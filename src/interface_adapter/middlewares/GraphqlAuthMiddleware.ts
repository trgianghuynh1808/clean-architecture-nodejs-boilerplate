import { EErrorCode } from '@storkyle/shared/enum';
import { CustomError } from '@storkyle/shared/error';
import { IContextGraphql } from '@storkyle/shared/interfaces';
import { skip } from '@storkyle/shared/libs';
import { castBoolean } from '@storkyle/shared/utilities';

// *INFO: internal modules

/**
 * Middleware: Authentication User
 * @param _
 * @param __
 * @param param2
 * @returns
 */
export const AuthenticationUser = async (
  _: any,
  __: any,
  context: IContextGraphql
): Promise<undefined> => {
  if (castBoolean(context.uid)) {
    return skip;
  }

  throw new CustomError(EErrorCode.UNAUTHENTICATED, 'application.error.permission.access_denied');
};
