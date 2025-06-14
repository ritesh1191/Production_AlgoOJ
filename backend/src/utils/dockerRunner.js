const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const initialize = async () => {
    try {
        // Check if required compilers are installed
        await Promise.all([
            execPromise('python3 --version'),
            execPromise('g++ --version'),
            execPromise('javac --version')
        ]);
        console.log('All required compilers are available');
    } catch (error) {
        console.warn('Some compilers might not be available:', error.message);
    }
};

const runCode = async (code, language, input) => {
    try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `code_${timestamp}`;
        const filePath = path.join(tempDir, `${fileName}.${getFileExtension(language)}`);
        
        // Write code to file
        await fs.writeFile(filePath, code);

        let result;
        switch (language.toLowerCase()) {
            case 'python':
                result = await runPythonCode(filePath, input);
                break;
            case 'cpp':
                result = await runCppCode(filePath, input);
                break;
            case 'java':
                result = await runJavaCode(filePath, input);
                break;
            default:
                throw new Error(`Unsupported language: ${language}`);
        }

        // Cleanup
        await cleanup(filePath);
        return result;
    } catch (error) {
        return {
            output: '',
            error: error.message,
            success: false
        };
    }
};

const runPythonCode = async (filePath, input) => {
    try {
        const { stdout, stderr } = await execPromise(
            `echo "${input}" | python3 ${filePath}`,
            { timeout: 5000 } // 5 second timeout
        );
        return {
            output: stdout,
            error: stderr,
            success: !stderr
        };
    } catch (error) {
        return {
            output: '',
            error: error.message,
            success: false
        };
    }
};

const runCppCode = async (filePath, input) => {
    try {
        const outputPath = filePath.replace('.cpp', '');
        // Compile
        await execPromise(`g++ ${filePath} -o ${outputPath}`);
        // Run
        const { stdout, stderr } = await execPromise(
            `echo "${input}" | ${outputPath}`,
            { timeout: 5000 }
        );
        return {
            output: stdout,
            error: stderr,
            success: !stderr
        };
    } catch (error) {
        return {
            output: '',
            error: error.message,
            success: false
        };
    }
};

const runJavaCode = async (filePath, input) => {
    try {
        const className = path.basename(filePath, '.java');
        // Compile
        await execPromise(`javac ${filePath}`);
        // Run
        const { stdout, stderr } = await execPromise(
            `echo "${input}" | java -cp ${path.dirname(filePath)} ${className}`,
            { timeout: 5000 }
        );
        return {
            output: stdout,
            error: stderr,
            success: !stderr
        };
    } catch (error) {
        return {
            output: '',
            error: error.message,
            success: false
        };
    }
};

const getFileExtension = (language) => {
    switch (language.toLowerCase()) {
        case 'python':
            return 'py';
        case 'cpp':
            return 'cpp';
        case 'java':
            return 'java';
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
};

const cleanup = async (filePath) => {
    try {
        // Remove source file
        await fs.unlink(filePath);
        
        // Remove compiled files if they exist
        const basePath = filePath.replace(/\.[^/.]+$/, '');
        const files = await fs.readdir(path.dirname(filePath));
        for (const file of files) {
            if (file.startsWith(path.basename(basePath)) && file !== path.basename(filePath)) {
                await fs.unlink(path.join(path.dirname(filePath), file));
            }
        }
    } catch (error) {
        console.warn('Cleanup error:', error.message);
    }
};

module.exports = {
    initialize,
    runCode
}; 