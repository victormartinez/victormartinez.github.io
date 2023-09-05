import React from "react"

import * as S from "./styled"

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month.toString().padStart(2, '0')}/${year}`;
}

const Talks = ({ talks }) => {
  const talkItems = talks.map(t => (
    <S.TalkItemWrapper>
      <S.ImageSection>
        {t.image && <S.Image fluid={t.image?.childImageSharp.fluid} />}
      </S.ImageSection>
      <S.TextSection>
        <S.Header>
          <S.Title>{t.title}</S.Title>
        </S.Header>
        <S.BodyItems>
          <S.Item>
            {`Evento: `}
            {
              t.website &&
              <S.Url to={t.website} target="_blank" rel="noopener noreferrer"> {t.event}</S.Url>
            }
            {!t.website && t.event}
          </S.Item>
          <S.Item>Quando: {formatDate(t.date)}</S.Item>
          <S.Item>Onde: {t.where}</S.Item>
          {t.slides && <S.Item><S.Url to={t.slides} target="_blank" rel="noopener noreferrer"> Slides</S.Url></S.Item>}
          {t.video && <S.Item><S.Url to={t.video} target="_blank" rel="noopener noreferrer"> Video</S.Url></S.Item>}
        </S.BodyItems>
      </S.TextSection>
    </S.TalkItemWrapper>
  ));

  return <S.TalkMain>{talkItems}</S.TalkMain>;
}



export default Talks
