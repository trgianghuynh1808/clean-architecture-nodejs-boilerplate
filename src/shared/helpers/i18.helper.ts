import { getAcceptLanguageFromHeader } from '@storkyle/shared/utilities';
import { Request, Response, Router } from 'express';
import i18n from 'i18n';
import path from 'path';

const i18nRouter = Router();

i18nRouter.use((req: Request, _res: Response, next) => {
  i18n.configure({
    locales: ['vi', 'en'],
    directory: path.join(__dirname, '..', '..', 'interface/locales'),
    objectNotation: true,
    logWarnFn: function (msg: any) {
      console.warn('warn', msg);
    },
  });
  i18n.setLocale(getAcceptLanguageFromHeader(req));
  next();
});

export { i18nRouter };
