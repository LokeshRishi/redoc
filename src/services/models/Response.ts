import { action, observable } from 'mobx';

import { OpenAPIResponse, Referenced } from '../../types';

import { getStatusCodeType } from '../../utils';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';
import { MediaContentModel } from './MediaContent';
import { ResponseCodes } from './ResponseCodes';

export class ResponseModel {
  @observable
  expanded: boolean;

  content?: MediaContentModel;
  code: string;
  summary: string;
  description: string;
  type: string;
  headers: FieldModel[] = [];
  responseCodes: ResponseCodes;

  constructor(
    parser: OpenAPIParser,
    code: string,
    defaultAsError: boolean,
    infoOrRef: Referenced<OpenAPIResponse>,
    options: RedocNormalizedOptions,
  ) {
    this.expanded = options.expandResponses === 'all' || options.expandResponses[code];

    const info = parser.deref(infoOrRef);
    parser.exitRef(infoOrRef);
    this.code = code;
    if (info.content !== undefined) {
      this.content = new MediaContentModel(parser, info.content, false, options);
    }

    if (info['x-summary'] !== undefined) {
      this.summary = info['x-summary'];
      this.description = info.description || '';
    } else {
      this.summary = info.description || '';
      this.description = '';
    }

    if (info['x-response-codes'] !== undefined) {
      this.responseCodes = info['x-response-codes'];
    }

    this.type = getStatusCodeType(code, defaultAsError);

    const headers = info.headers;
    if (headers !== undefined) {
      this.headers = Object.keys(headers).map(name => {
        const header = headers[name];
        return new FieldModel(parser, { ...header, name }, '', options);
      });
    }
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
