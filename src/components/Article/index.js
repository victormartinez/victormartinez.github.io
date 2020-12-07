import React from "react"

import * as S from "./styled"

import Rating from "../Rating"
import ImageCredits from "../ImageCredits"

const Article = ({ post }) => {
  return (
    <S.Article>
      <S.Header>
        <S.Headline>{post.frontmatter.title}</S.Headline>
        <S.Date>{post.frontmatter.date}</S.Date>
        <S.TagsWrapper>
          <S.TagsList>
            <S.TagItemFirst>Tags:</S.TagItemFirst>
            {post.frontmatter.tags.map(tag => (
              <S.TagItem>{tag}</S.TagItem>
            ))}
          </S.TagsList>
        </S.TagsWrapper>
      </S.Header>
      {post.frontmatter.rating && <Rating value={post.frontmatter.rating} />}
      <S.Section
        dangerouslySetInnerHTML={{ __html: post.html }}
        itemProp="articleBody"
      />
      <ImageCredits
        url={post.frontmatter.image_url}
        author={post.frontmatter.image_author}
      />
    </S.Article>
  )
}

export default Article
