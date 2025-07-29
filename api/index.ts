import bootstrap from '../src/server';

export default async function handler(req: any, res: any) {
    const app = await bootstrap();
    return app(req, res);
}