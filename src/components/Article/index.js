import React from "react"

import { useIntl } from "gatsby-plugin-intl"

import * as S from "./styled"

import Rating from "../Rating"
import ImageCredits from "../ImageCredits"
import Alert from "../Alert"
import { isPostDeprecated, formatDate } from "../../utils/date"

const Article = ({ post }) => {
  const intl = useIntl()

  return (
    <S.Article>
      <S.Header>
        <S.Headline>{post.frontmatter.title}</S.Headline>
        <S.Date>
          {formatDate(post.frontmatter.date, "pt")} • {post.timeToRead} min{" "}
          {intl.formatMessage({ id: "reading" })}
        </S.Date>
        <S.TagsWrapper>
          <S.TagsList>
            <S.TagItemFirst>Tags:</S.TagItemFirst>
            {post.frontmatter.tags.map((tag, index) => (
              <S.TagItem key={index}>{tag}</S.TagItem>
            ))}
          </S.TagsList>
        </S.TagsWrapper>
      </S.Header>
      {post.frontmatter.rating && <Rating value={post.frontmatter.rating} />}

      {isPostDeprecated(post.frontmatter.date) && (
        <Alert msg={intl.formatMessage({ id: "Warning_deprecated" })} />
      )}

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
