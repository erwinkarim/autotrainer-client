/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/* eslint max-len: ["error", 100] */

import SHA256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';
import HmacSHA256 from 'crypto-js/hmac-sha256';

const sigV4Client = {};
sigV4Client.newClient = (config) => {
  const AWS_SHA_256 = 'AWS4-HMAC-SHA256';
  const AWS4_REQUEST = 'aws4_request';
  const AWS4 = 'AWS4';
  const X_AMZ_DATE = 'x-amz-date';
  const X_AMZ_SECURITY_TOKEN = 'x-amz-security-token';
  const HOST = 'host';
  const AUTHORIZATION = 'Authorization';

  // eslint-disable-line
  const hash = value => SHA256(value);

  const hexEncode = value => value.toString(encHex);

  const hmac = (secret, value) => HmacSHA256(value, secret, { asBytes: true }); // eslint-disable-line

  const buildCanonicalUri = uri => encodeURI(uri);

  const buildCanonicalQueryString = (queryParams) => {
    if (Object.keys(queryParams).length < 1) {
      return '';
    }

    const sortedQueryParams = [];
    for (let property in queryParams) {
      if (queryParams.hasOwnProperty(property)) {
        sortedQueryParams.push(property);
      }
    }
    sortedQueryParams.sort();

    let canonicalQueryString = '';
    for (let i = 0; i < sortedQueryParams.length; i += 1) {
      canonicalQueryString +=
        `${sortedQueryParams[i]
        }=${
          encodeURIComponent(queryParams[sortedQueryParams[i]])
        }&`;
    }
    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
  };

  const buildCanonicalHeaders = (headers) => {
    let canonicalHeaders = '';
    const sortedKeys = [];
    for (let property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property);
      }
    }
    sortedKeys.sort();

    for (let i = 0; i < sortedKeys.length; i += 1) {
      canonicalHeaders +=
        `${sortedKeys[i].toLowerCase()}:${headers[sortedKeys[i]]}\n`;
    }
    return canonicalHeaders;
  };

  const buildCanonicalSignedHeaders = (headers) => {
    const sortedKeys = [];
    for (let property in headers) {
      if (headers.hasOwnProperty(property)) {
        sortedKeys.push(property.toLowerCase());
      }
    }
    sortedKeys.sort();

    return sortedKeys.join(';');
  };

  const buildCanonicalRequest = (method, path, queryParams, headers, payload) => (
    `${method
    }\n${
      buildCanonicalUri(path)
    }\n${
      buildCanonicalQueryString(queryParams)
    }\n${
      buildCanonicalHeaders(headers)
    }\n${
      buildCanonicalSignedHeaders(headers)
    }\n${
      hexEncode(hash(payload))}`
  );

  const hashCanonicalRequest = request => hexEncode(hash(request));


  const buildStringToSign = (datetime, credentialScope, hashedCanonicalRequest) => (
    `${AWS_SHA_256}\n${datetime}\n${credentialScope}\n${hashedCanonicalRequest}`
  );

  const buildCredentialScope = (datetime, region, service) => (
    `${datetime.substr(0, 8)}/${region}/${service}/${AWS4_REQUEST}`
  );

  const calculateSigningKey = (secretKey, datetime, region, service) => hmac(
    hmac(
      hmac(hmac(AWS4 + secretKey, datetime.substr(0, 8)), region),
      service,
    ),
    AWS4_REQUEST,
  );

  const calculateSignature = (key, stringToSign) => hexEncode(hmac(key, stringToSign));

  const buildAuthorizationHeader = (accessKey, credentialScope, headers, signature) => (
    `${AWS_SHA_256} Credential=${accessKey}/${credentialScope}, SignedHeaders=${
      buildCanonicalSignedHeaders(headers)}, Signature=${signature}`
  );

  const awsSigV4Client = {};
  if (config.accessKey === undefined || config.secretKey === undefined) {
    return awsSigV4Client;
  }
  awsSigV4Client.accessKey = config.accessKey;
  awsSigV4Client.secretKey = config.secretKey;
  awsSigV4Client.sessionToken = config.sessionToken;
  awsSigV4Client.serviceName = config.serviceName || 'execute-api';
  awsSigV4Client.region = config.region || 'ap-southeast-1';
  awsSigV4Client.defaultAcceptType =
    config.defaultAcceptType || 'application/json';
  awsSigV4Client.defaultContentType =
    config.defaultContentType || 'application/json';

  const invokeUrl = config.endpoint;
  const endpoint = /(^https?:\/\/[^/]+)/g.exec(invokeUrl)[1];
  const pathComponent = invokeUrl.substring(endpoint.length);

  awsSigV4Client.endpoint = endpoint;
  awsSigV4Client.pathComponent = pathComponent;

  awsSigV4Client.signRequest = (request) => {
    const verb = request.method.toUpperCase();
    const path = awsSigV4Client.pathComponent + request.path;
    const queryParams = { ...request.queryParams };
    const headers = { ...request.headers };

    // If the user has not specified an override for Content type the use default
    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = awsSigV4Client.defaultContentType;
    }

    // If the user has not specified an override for Accept type the use default
    if (headers.Accept === undefined) {
      headers.Accept = awsSigV4Client.defaultAcceptType;
    }

    let body = { ...request.body };
    // override request body and set to empty when signing GET requests
    if (request.body === undefined || verb === 'GET') {
      body = '';
    } else {
      body = JSON.stringify(body);
    }

    // If there is no body remove the content-type header so it is not
    // included in SigV4 calculation
    if (body === '' || body === undefined || body === null) {
      delete headers['Content-Type'];
    }

    const datetime = new Date()
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z')
      .replace(/[:-]|\.\d{3}/g, '');
    headers[X_AMZ_DATE] = datetime;
    const parser = new URL(awsSigV4Client.endpoint);
    headers[HOST] = parser.hostname;

    const canonicalRequest = buildCanonicalRequest(
      verb,
      path,
      queryParams,
      headers,
      body,
    );
    const hashedCanonicalRequest = hashCanonicalRequest(canonicalRequest);
    const credentialScope = buildCredentialScope(
      datetime,
      awsSigV4Client.region,
      awsSigV4Client.serviceName,
    );
    const stringToSign = buildStringToSign(
      datetime,
      credentialScope,
      hashedCanonicalRequest,
    );
    const signingKey = calculateSigningKey(
      awsSigV4Client.secretKey,
      datetime,
      awsSigV4Client.region,
      awsSigV4Client.serviceName,
    );
    const signature = calculateSignature(signingKey, stringToSign);
    headers[AUTHORIZATION] = buildAuthorizationHeader(
      awsSigV4Client.accessKey,
      credentialScope,
      headers,
      signature,
    );
    if (
      awsSigV4Client.sessionToken !== undefined &&
      awsSigV4Client.sessionToken !== ''
    ) {
      headers[X_AMZ_SECURITY_TOKEN] = awsSigV4Client.sessionToken;
    }
    delete headers[HOST];

    let url = awsSigV4Client.endpoint + path;
    const queryString = buildCanonicalQueryString(queryParams);
    if (queryString !== '') {
      url += `?${queryString}`;
    }

    // Need to re-attach Content-Type if it is not specified at this point
    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = awsSigV4Client.defaultContentType;
    }

    return {
      headers,
      url,
    };
  };

  return awsSigV4Client;
};

export default sigV4Client;
