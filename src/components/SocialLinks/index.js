import React from "react"

import { GithubWithCircle as Github } from "@styled-icons/entypo-social/GithubWithCircle"
import { TwitterWithCircle as Twitter } from "@styled-icons/entypo-social/TwitterWithCircle"
import { LinkedinWithCircle as Linkedin } from "@styled-icons/entypo-social/LinkedinWithCircle"
import { SpeakerDeck } from "@styled-icons/fa-brands/SpeakerDeck"

import * as S from "./styled"

const SocialLinks = ({ data }) => {
  const socialIcons = [
    {
      url: `https://twitter.com/${data.twitter}`,
      element: Twitter,
      label: "Twitter",
    },
    {
      url: `https://linkedin.com/in/${data.linkedin}`,
      element: Linkedin,
      label: "Linkedin",
    },
    {
      url: `https://github.com/${data.github}`,
      element: Github,
      label: "Github",
    },
    {
      url: `https://speakerdeck.com/${data.speakerdeck}`,
      element: SpeakerDeck,
      label: "SpeakerDeck",
    },
  ]

  return (
    <S.SocialWrapper>
      <S.SocialItemList>
        {socialIcons.map((social, i) => {
          const Element = social.element
          return (
            <S.SocialItem key={i}>
              <S.SocialItemLink
                href={social.url}
                title={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <S.IconWrapper>
                  <Element />
                </S.IconWrapper>
              </S.SocialItemLink>
            </S.SocialItem>
          )
        })}
      </S.SocialItemList>
    </S.SocialWrapper>
  )
}

export default SocialLinks
