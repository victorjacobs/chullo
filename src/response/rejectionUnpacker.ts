import { Response } from 'express';
// Unpacks promise rejection message into a Express response
export default function rejectionUnpacker(res: Response) {
    return (err: {
        code: number,
        msg: string
    }) => {
        const code = err.code ? err.code : 400;
        const msg = err.msg ? err.msg : undefined;
        res.status(code).send(msg);
    };
}
