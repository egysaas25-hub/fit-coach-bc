import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesLoader } from '../../src/exercises/exercises.loader';
import { ExercisesService } from '../../src/exercises/exercises.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Property 37: DataLoader Query Batching', () => {
    let loader: ExercisesLoader;
    let exercisesService: ExercisesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExercisesLoader,
                ExercisesService,
                {
                    provide: PrismaService,
                    useValue: {
                        exercises: {
                            findMany: jest.fn().mockResolvedValue([
                                { id: BigInt(1), tenant_id: BigInt(1), name: 'Ex 1' },
                                { id: BigInt(2), tenant_id: BigInt(1), name: 'Ex 2' },
                            ]),
                        },
                    },
                },
            ],
        }).compile();

        loader = await module.resolve<ExercisesLoader>(ExercisesLoader);
        exercisesService = module.get<ExercisesService>(ExercisesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should batch multiple load calls into a single database query', async () => {
        const ids = ['1', '2'];

        // Call load multiple times concurrently
        const promises = ids.map(id => loader.batchExercises.load(id));
        const results = await Promise.all(promises);

        // Verify results
        expect(results).toHaveLength(2);
        expect(results[0].id).toBe('1');
        expect(results[1].id).toBe('2');

        // Verify findMany was called only once
        expect(prismaService.exercises.findMany).toHaveBeenCalledTimes(1);

        // Verify arguments
        const callArgs = (prismaService.exercises.findMany as jest.Mock).mock.calls[0][0];
        expect(callArgs.where.id.in).toHaveLength(2);
    });
});
