import {
  DateResolver,
  DateTimeResolver,
  EmailAddressResolver,
  NonEmptyStringResolver,
} from 'graphql-scalars';

import GraphQLJSON from 'graphql-type-json';

exports.Date = DateResolver;
exports.DateTime = DateTimeResolver;
exports.Email = EmailAddressResolver;
exports.NonEmptyString = NonEmptyStringResolver;
exports.JSON = GraphQLJSON;
