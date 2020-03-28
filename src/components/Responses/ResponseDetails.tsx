import * as React from 'react';

import { ResponseModel } from '../../services/models';

import { UnderlinedHeader } from '../../common-elements';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';
import { Schema } from '../Schema';

import { Markdown } from '../Markdown/Markdown';
import { ResponseHeaders } from './ResponseHeaders';

export class ResponseDetails extends React.PureComponent<{ response: ResponseModel }> {
  render() {
    const { description, headers, content, responseCodes } = this.props.response;
    return (
      <>
        {description && <Markdown source={description} />}
        <ResponseHeaders headers={headers} />
        <MediaTypesSwitch content={content} renderDropdown={this.renderDropdown}>
          {({ schema }) => {
            return <Schema skipWriteOnly={true} key="schema" schema={schema} />;
          }}
        </MediaTypesSwitch>
        {this.errorCodeContainer(responseCodes)}
      </>
    );
  }

  private renderDropdown = props => {
    return (
      <UnderlinedHeader key="header">
        Response Schema: <DropdownOrLabel {...props} />
      </UnderlinedHeader>
    );
  };

  private errorCodeContainer(responseCodes) {
    if (responseCodes && responseCodes.errors) {
      return (<>
        <UnderlinedHeader key="header">
          Response Codes
        </UnderlinedHeader>
        <div className="response-codes-container">
          <table className="response-codes">
            <thead>
              <tr>
                <th>Code</th>
                <th>Domain</th>
                <th>Category</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(responseCodes.errors).map(function (key) {
                  return <tr><td>{key}</td> <td>{responseCodes.errors[key].domain}</td> <td>{responseCodes.errors[key].category}</td> <td>{responseCodes.errors[key].description}</td></tr>;
                })
              }
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
      </>);
    }
  }
}
