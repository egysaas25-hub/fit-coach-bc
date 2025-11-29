import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';

// Skip DB connection during schema generation
process.env.SKIP_DB_CONNECTION = 'true';

async function generateSchema() {
    console.log('🔄 Generating GraphQL schema...');

    try {
        // Import AppModule dynamically to avoid DB connection issues
        const { AppModule } = await import('../src/app.module');

        // Create the application
        const app = await NestFactory.create(AppModule, {
            logger: ['error', 'warn'],
            abortOnError: false
        });

        await app.init();

        // Check if schema.gql was generated
        const schemaPath = path.join(process.cwd(), 'schema.gql');

        if (fs.existsSync(schemaPath)) {
            // Copy to generated folder for frontend sharing
            const generatedDir = path.join(process.cwd(), 'generated');
            if (!fs.existsSync(generatedDir)) {
                fs.mkdirSync(generatedDir, { recursive: true });
            }

            const targetPath = path.join(generatedDir, 'schema.graphql');
            fs.copyFileSync(schemaPath, targetPath);

            console.log('✅ Schema generated successfully!');
            console.log(`   📄 ${schemaPath}`);
            console.log(`   📄 ${targetPath}`);

            // Show schema stats
            const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
            const lines = schemaContent.split('\n').length;
            const types = (schemaContent.match(/type \w+/g) || []).length;
            const queries = (schemaContent.match(/\w+.*:/g) || []).filter(l =>
                schemaContent.indexOf(`type Query`) > -1 &&
                schemaContent.substring(
                    schemaContent.indexOf(`type Query`),
                    schemaContent.indexOf(`}`, schemaContent.indexOf(`type Query`))
                ).includes(l)
            ).length;

            console.log(`   📊 Stats: ${lines} lines, ${types} types, ${queries} queries`);
        } else {
            throw new Error('Schema file was not generated');
        }

        await app.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Schema generation failed!');
        console.error('Error:', error.message);

        // Write error details to file
        const errorLog = path.join(process.cwd(), 'schema-error.log');
        fs.writeFileSync(
            errorLog,
            JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        );
        console.error(`   Error details written to: ${errorLog}`);

        process.exit(1);
    }
}

generateSchema();
