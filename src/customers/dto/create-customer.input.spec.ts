import { validate } from 'class-validator';
import { CreateCustomerInput } from './create-customer.input';

describe('Customer Property Validation', () => {
    it('should validate a valid customer input', async () => {
        const input = new CreateCustomerInput();
        input.tenantId = '1';
        input.name = 'John Doe';
        input.email = 'john@example.com';
        input.phone = '+1234567890';
        input.status = 'active';

        const errors = await validate(input);
        expect(errors.length).toBe(0);
    });

    it('should fail if required fields are missing', async () => {
        const input = new CreateCustomerInput();
        // Missing tenantId, name, email

        const errors = await validate(input);
        expect(errors.length).toBeGreaterThan(0);

        const errorProperties = errors.map(e => e.property);
        expect(errorProperties).toContain('tenantId');
        expect(errorProperties).toContain('name');
        expect(errorProperties).toContain('email');
    });

    it('should fail if email is invalid', async () => {
        const input = new CreateCustomerInput();
        input.tenantId = '1';
        input.name = 'John Doe';
        input.email = 'invalid-email';

        const errors = await validate(input);
        const emailError = errors.find(e => e.property === 'email');
        expect(emailError).toBeDefined();
        expect(emailError?.constraints).toHaveProperty('isEmail');
    });
});
