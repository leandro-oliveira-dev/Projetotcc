import { Request, Response } from 'express';

import { prisma } from '@/database';

export class doarController {

    static async CreateDoar(request: Request, response: Response) {
        const createdDoar = await prisma.doar.create({
            data: {
        
            },
          });

}
