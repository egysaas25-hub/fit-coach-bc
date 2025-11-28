import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesResolver } from './exercises.resolver';
import { ExercisesService } from './exercises.service';
import { ExerciseFilterInput } from './dto/exercise-filter.input';

describe('ExercisesResolver', () => {
    let resolver: ExercisesResolver;
    let service: ExercisesService;

    const mockExercisesService = {
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExercisesResolver,
                { provide: ExercisesService, useValue: mockExercisesService },
            ],
        }).compile();

        resolver = module.get<ExercisesResolver>(ExercisesResolver);
        service = module.get<ExercisesService>(ExercisesService);
    });

    it('should construct correct where clause for filters', async () => {
        const filter: ExerciseFilterInput = {
            muscleGroupId: '1',
            trainingTypeId: '2',
            skip: 0,
            take: 10,
        };

        await resolver.findAll(filter);

        expect(service.findAll).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
            where: {
                muscle_group_id: BigInt('1'),
                training_type_id: BigInt('2'),
            },
        });
    });

    it('should handle empty filter', async () => {
        await resolver.findAll();
        expect(service.findAll).toHaveBeenCalledWith({
            skip: undefined,
            take: undefined,
            where: {},
        });
    });
});
