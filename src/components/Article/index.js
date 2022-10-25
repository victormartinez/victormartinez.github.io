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
    <S.Article itemscope itemtype="https://schema.org/BlogPosting">
      <S.Header>
        <S.Headline itemprop="headline">{post.frontmatter.title}</S.Headline>
        <S.DateBox>
          <S.Date itemprop="datePublished">
            {formatDate(post.frontmatter.date, intl.locale)}
          </S.Date>{" "}
          • {post.timeToRead} min {intl.formatMessage({ id: "reading" })}
        </S.DateBox>
      </S.Header>
      {post.frontmatter.rating && <Rating value={post.frontmatter.rating} />}

      {isPostDeprecated(post.frontmatter.date) && (
        <Alert msg={intl.formatMessage({ id: "Warning_deprecated" })} />
      )}

      <S.Section
        itemprop="articleBody"
        dangerouslySetInnerHTML={{ __html: post.html }}
        itemProp="articleBody"
      />
      <S.TagsWrapper>
        <S.TagsList itemprop="keywords">
          <S.TagItemFirst>Tags:</S.TagItemFirst>
          {post.frontmatter.tags.map((tag, index) => (
            <S.TagItem key={index}>{tag}</S.TagItem>
          ))}
        </S.TagsList>
      </S.TagsWrapper>
      <ImageCredits
        url={post.frontmatter.image_url}
        author={post.frontmatter.image_author}
      />
    </S.Article>
  )
}

export default Article
