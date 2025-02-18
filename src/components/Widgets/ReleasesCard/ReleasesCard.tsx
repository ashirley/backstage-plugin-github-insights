/*
 * Copyright 2020 RoadieHQ
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { Link, List, ListItem, Chip, makeStyles } from '@material-ui/core';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { useRequest } from '../../../hooks/useRequest';
import { useUrl } from '../../../hooks/useUrl';
import { useProjectEntity } from '../../../hooks/useProjectEntity';
import { useEntity } from "@backstage/plugin-catalog-react";

const useStyles = makeStyles((theme) => ({
  infoCard: {
    marginBottom: theme.spacing(3),
    '& + .MuiAlert-root': {
      marginTop: theme.spacing(3),
    },
  },
  releaseTitle: {
    fontSize: '1.1rem',
    fontWeight: theme.typography.fontWeightMedium,
    margin: 0,
    marginRight: '0.5rem', 
  },
  releaseTagIcon: {
    verticalAlign: 'middle',
  },
  listItem: {
    justifyContent: 'space-between'
  },
}));

type Release = {
  id: number;
  html_url: string;
  tag_name: string;
  prerelease: boolean;
  name: string;
};

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

const ReleasesCard = (_props: Props) => {
  const { entity } = useEntity();
  const { owner, repo } = useProjectEntity(entity);
  const classes = useStyles();
  const { value, loading, error } = useRequest(entity, 'releases', 0, 5);
  const { hostname } = useUrl();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return (
      <Alert severity="error" className={classes.infoCard}>
        {error.message}
      </Alert>
    );
  }

  return value?.length && owner && repo ? (
    <InfoCard
      title="Releases"
      deepLink={{
        link: `//${hostname}/${owner}/${repo}/releases`,
        title: 'Releases',
        onClick: (e) => {
          e.preventDefault();
          window.open(`//${hostname}/${owner}/${repo}/releases`);
        },
      }}
      className={classes.infoCard}
    >
      <List>
        {value.map((release: Release) => (
          <ListItem className={classes.listItem} key={release.id}>
            <Link
              href={release.html_url}
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
            <p className={classes.releaseTitle}>{release.name}</p>
            <LocalOfferOutlinedIcon fontSize="inherit" className={classes.releaseTagIcon} /> {release.tag_name}
              {/* by {release.author.login} */}
            </Link>
            {release.prerelease && <Chip color="primary" size="small" label="Pre-release"/>}
          </ListItem>
        ))}
      </List>
    </InfoCard>
  ) : (
    <></>
  );
};

export default ReleasesCard;
