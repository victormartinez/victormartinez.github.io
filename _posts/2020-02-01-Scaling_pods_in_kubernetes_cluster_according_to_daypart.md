---
layout: post
title: "Scaling pods in Kubernetes cluster according to daypart"
categories: [DevOps]
tags: [kubernetes, devops, k8s, autoscaling, hpa]
image: /assets/images/highlights/tiller.jpeg
on_post: false
toc: false
featured: true
---

There are businesses that heavily rely on specific periods of day to make profit. Food ordering companies, for example, tend to have a heated operation during midday and the opposite behavior in other dayparts. Regarding the infrastructure, the phenomenon is particularly interesting because in a specific period your application receives an impressive amount of requests and the cluster must be able to scale really fast to avoid errors otherwise customers might face slowness and decide to use another platform to order (churn). The chart below exemplifies the scenario.

![Daypart behavior](/assets/images/posts/daypart_behavior_chart.png "Daypart behavior")

You might wonder whether the problem can be solved with a simple autoscaling mechanism. Well, that works for ~95% of the customers but ~5% will have issues. The velocity of scaling up the infrastructure might not be fast enought to address the avalanche of requests. Luckily, a nice solution (so far) is to scale the machines beforehand. If you have a Kubernetes cluster the solution is easier than you think: a combination of Horizontal Pod Autoscaling and CronJobs does the trick.

A special thanks to [Robson Peixoto](https://www.linkedin.com/in/robsonpeixoto/) for providing me guidance to accomplish the task.

## General Overview
We want to create a cronjob with the right permissions to edit autoscaling properties. Bear in mind that we want, basically, to create an agent that can edit the cluster properties from inside the cluster. The image below illustrates the scenario.

![Diagram illustrating before and after scenarios](/assets/images/posts/before_after_cronscale.png "Diagram illustrating before and after scenarios")

## Horizontal Pod Autoscaler
Since the CronJob is going to **edit** the cluster properties we need a basic Horizontal Pod Autoscaler available. The yaml code below illustrates the scaling of a backend web application located inside the backend namespace.


```yaml
kind: HorizontalPodAutoscaler
apiVersion: autoscaling/v2beta1
metadata:
  name: backend-autoscale
  namespace: backend
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-web
  minReplicas: 30
  maxReplicas: 50 
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageValue: 120m
```

## Permissions
Now, it is time to configure cronjob permissions. To do so, we will use the RBAC to grant access to Kubernetes API and make sure it has only permission to access the autoscaling resource. I use the term `cronscale` to identify the process of scaling according to the cronjob.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: backend-cronscale
  namespace: backend
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: backend-cronscale
  namespace: backend
rules:
- apiGroups: ["autoscaling"]
  resources: ["horizontalpodautoscalers"]
  verbs: ["*"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: backend-cronscale
  namespace: backend
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: backend-cronscale
subjects:
- kind: ServiceAccount
  name: backend-cronscale
  namespace: backend
```

## Application
Before creating the CronJob, we need to create the image/application responsible for updating the autoscaling properties. For that, I suggest using the [python client](https://github.com/kubernetes-client/python). The code snippet below is just an example of implementation that you can use. Feel free to change according your necessities.

```python
# settings.py

PROJECTS = {
    "backend": {
        "HPA": {
            "NAMESPACE": "backend",
            "HPA": "backend-autoscale",
            "TARGET": "backend-web",
        }
    }
}
```

Instead of keeping string floating around the code, I use a settings module to store the properties related to each project...

```python
# hpa.py
from kubernetes import config                                                                                                                     
                                                                                                                                                  
config.load_incluster_config()                                                                                                                    
                                                                                                                                                  
from kubernetes import client                                                                                                                     
                                                                                                                                                  
import settings                                                                                                                                   
                                                                                                                                                  
                                                                                                                                                  
def scale(project_name: str, min_replicas: int, max_replicas: int):                                                                               
    config = settings.PROJECTS[project_name]["HPA"]                                                                                               
    scale_target_ref = client.V1CrossVersionObjectReference(                                                                                      
        api_version="extensions/v1beta1", kind="Deployment", name=config["TARGET"]                                                                
    )                                                                                                                                             
    spec = client.V1HorizontalPodAutoscalerSpec(                                                                                                  
        min_replicas=min_replicas,                                                                                                                
        max_replicas=max_replicas,                                                                                                                
        scale_target_ref=scale_target_ref,                                                                                                        
    )                                                                                                                                             
    metadata = client.V1ObjectMeta(name=config["HPA"], namespace=config["NAMESPACE"])                                                             
    autoscaler = client.V1HorizontalPodAutoscaler(                                                                                                
        api_version="autoscaling/v2beta1",                                                                                                        
        kind="HorizontalPodAutoscaler",                                                                                                           
        metadata=metadata,                                                                                                                        
        spec=spec,                                                                                                                                
    )                                                                                                                                             
                                                                                                                                                  
    hpa_api = client.AutoscalingV1Api()                                                                                                           
    return hpa_api.patch_namespaced_horizontal_pod_autoscaler(                                                                                    
        config["HPA"], config["NAMESPACE"], autoscaler                                                                                            
    )
```

... then I can pass the project name (`backend`) to the `scale` function and it knows where to get the properties.


## CronJob 
Now that we have the permissions, it is time to create the CronJob. Pay attention to the 12th line because it allows kubernetes to run the pod with the permissions we have setup before.

```yaml
apiVersion: batch/v9beta1                                                                                                                         
kind: CronJob                                                                                                                                     
metadata:                                                                                                                                         
  name: cronscale-midday                                                                                                              
  namespace: backend                                                                                                                         
spec:                                                                                                                                             
  schedule: "<YOUR-CRON-GOES-HERE>" # UTC
  jobTemplate:                                                                                                                                    
    spec:                                                                                                                                         
      template:                                                                                                                                   
        spec:                                                                                                                                     
          serviceAccountName: backend-cronscale                                                                                              
          restartPolicy: Never                                                                                                                    
          containers:                                                                                                                             
          - name: job                                                                                                                             
            image: <YOUR-IMAGE-AND-VERSION-GOES-HERE>
            imagePullPolicy: IfNotPresent                                                                                                         
            command: [<YOUR-COMMAND-GOES-HERE>]
```

## Important Considerations
It is important to be carefull regarding some points:

1. **UTC vs LocalTime:** Configure the Dockerfile to use UTC time and consider it in the `schedule` property.
2. **Click:** You can wrap the python code with [Click](https://click.palletsprojects.com/en/7.x/) to create an easy to use command line interface.
3. **Non-root user:** Do not use root user for the Dockerfile. You can take the Dockerfile below as a starting point:

```dockerfile
FROM python:3.7

ENV PYTHONUNBUFFERED=1

ENV TZ=UTC

RUN useradd -ms /bin/bash app

USER app

WORKDIR /home/app

ADD . /home/app

RUN pip install --upgrade pip && pip install -r requirements.txt
```

---

*\*Photo by [Frank Eiffert](https://unsplash.com/photos/G9gHtroxnaI) on [Unsplash](https://unsplash.com)*

