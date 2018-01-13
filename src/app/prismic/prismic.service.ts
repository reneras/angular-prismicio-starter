import PrismicToolbar from 'prismic-toolbar';
import { Injectable } from '@angular/core';
import Prismic from 'prismic-javascript';

import { Context } from './context';
import { Preview } from './preview';
import { CONFIG } from '../../prismic-configuration';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PrismicService {

  constructor(private httpClient: HttpClient ) {}

  buildContext() {
    const options = {};
    return Prismic.api(CONFIG.apiEndpoint, {accessToken: CONFIG.accessToken})
      .then((api) => {
        return {
          api,
          endpoint: CONFIG.apiEndpoint,
          accessToken: CONFIG.accessToken,
          linkResolver: CONFIG.linkResolver,
          toolbar: this.toolbar,
        } as Context;
      })
      .catch(e => console.log(`Error during connection to your Prismic API: ${e}`));
  }

  validateOnboarding() {
    const infos = this.getRepositoryInfos();

    if(infos.isConfigured) {
      this.httpClient.post(`${infos.repoURL}/app/settings/onboarding/run`, null, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
      .subscribe(
        null,
        (err) => console.log(`Cannot access your repository, check your api endpoint: ${err}`)
      );
    }
  }

  getRepositoryInfos() {
    const repoRegexp = /^(https?:\/\/([-\w]+)\.[a-z]+\.(io|dev))\/api(\/v2)?$/;
    const [_, repoURL, name] = CONFIG.apiEndpoint.match(repoRegexp);
    const isConfigured = name !== 'your-repo-name';
    return { repoURL, name, isConfigured };
  }

  toolbar(api) {
    const maybeCurrentExperiment = api.currentExperiment();
    if (maybeCurrentExperiment) {
      PrismicToolbar.startExperiment(maybeCurrentExperiment.googleId());
    }
    PrismicToolbar.setup(CONFIG.apiEndpoint);
  }

  preview(token) {
    return this.buildContext()
    .then(ctx => {
      return ctx.api.previewSession(token, ctx.linkResolver, '/').then((url) => {
        return {
          cookieName: Prismic.previewCookie,
          token: token,
          redirectURL: url
        } as Preview;
      });
    });
  }
}
