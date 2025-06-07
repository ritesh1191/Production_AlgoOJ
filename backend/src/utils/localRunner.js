const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const execAsync = promisify(exec);

class LocalRunner {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp');
    }

    async initialize() {
        // Create temp directory if it doesn't exist
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
            console.log('Temporary directory setup completed');
        } catch (error) {
            console.error('Error setting up temp directory:', error);
            throw error;
        }
    }

    async runCode(code, language, input = '') {
        const fileId = uuidv4();
        let sourceFile, command;

        try {
            // For deployment, we'll just support JavaScript/Node.js initially
            // You can add more language support later
            sourceFile = `${fileId}.js`;
            command = `node ${sourceFile}`;

            // Write code to file
            await fs.writeFile(path.join(this.tempDir, sourceFile), code);
            if (input) {
                await fs.writeFile(path.join(this.tempDir, `${fileId}.txt`), input);
            }

            // Run code with timeout
            const timeout = process.env.MAX_EXECUTION_TIME || 5;
            const { stdout, stderr } = await execAsync(
                `cd ${this.tempDir} && ${command} < ${fileId}.txt`,
                { timeout: timeout * 1000 }
            );

            // Cleanup
            await this.cleanup(fileId);

            return {
                success: true,
                output: stdout,
                error: stderr
            };
        } catch (error) {
            await this.cleanup(fileId);
            
            if (error.killed || error.signal === 'SIGTERM') {
                return {
                    success: false,
                    error: 'Execution timed out'
                };
            }

            return {
                success: false,
                error: error.stderr || error.message
            };
        }
    }

    async cleanup(fileId) {
        try {
            // Remove temp files
            const files = await fs.readdir(this.tempDir);
            for (const file of files) {
                if (file.startsWith(fileId)) {
                    await fs.unlink(path.join(this.tempDir, file));
                }
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }

    // This is just a placeholder to maintain API compatibility
    async stopContainer() {
        return;
    }
}

module.exports = new LocalRunner(); 