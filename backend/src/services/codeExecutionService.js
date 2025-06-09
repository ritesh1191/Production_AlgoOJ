const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, '..', 'temp');
const bitsDir = path.join(tempDir, 'bits');

// Function to clean up temp directory
const cleanupTempFiles = async () => {
  try {
    // Check if directory exists before trying to read it
    try {
      await fs.access(tempDir);
    } catch (err) {
      // Directory doesn't exist, create it
      await fs.mkdir(tempDir, { recursive: true });
      console.log('Created temp directory');
      return;
    }

    const files = await fs.readdir(tempDir);
    await Promise.all(
      files.map(file => fs.unlink(path.join(tempDir, file)))
    );
    console.log('Temp files cleaned up successfully');
  } catch (error) {
    console.error('Error managing temp files:', error.message);
  }
};

// Clean up temp files on startup
cleanupTempFiles().catch(console.error);

// Create bits directory and stdc++.h
const setupBitsHeader = async () => {
  try {
    await fs.mkdir(bitsDir, { recursive: true });
    const stdcppPath = path.join(bitsDir, 'stdc++.h');
    const stdcppContent = `
// C++ includes used for precompiling -*- C++ -*-
#ifndef _GLIBCXX_NO_WARNS
#pragma GCC system_header
#endif

// C++ includes
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <utility>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <deque>
#include <stack>
#include <list>
#include <bitset>
#include <numeric>
#include <iterator>
#include <functional>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cassert>
#include <complex>
#include <random>
#include <chrono>
#include <array>
#include <tuple>
`;
    await fs.writeFile(stdcppPath, stdcppContent);
  } catch (error) {
    console.error('Error setting up bits header:', error);
  }
};

// Setup bits header on startup
setupBitsHeader().catch(console.error);

const languageConfigs = {
  python: {
    extension: '.py',
    command: 'python3',
    compileCommand: null,
  },
  cpp: {
    extension: '.cpp',
    command: './a.out',
    compileCommand: 'g++',
  },
  java: {
    extension: '.java',
    command: 'java',
    compileCommand: 'javac',
  }
};

const createTempFile = async (code, language) => {
  const fileName = `${uuidv4()}${languageConfigs[language].extension}`;
  const filePath = path.join(tempDir, fileName);
  await fs.writeFile(filePath, code);
  return filePath;
};

const compileCppCode = async (filePath) => {
  return new Promise((resolve, reject) => {
    const process = spawn('g++', [
      filePath,
      '-std=c++17',
      `-I${tempDir}`
    ]);
    
    let stderr = '';
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Compilation error: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
};

const compileJavaCode = async (filePath) => {
  return new Promise((resolve, reject) => {
    const process = spawn('javac', [filePath]);
    
    let stderr = '';
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Compilation error: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
};

const executeCode = async (code, language, input = '') => {
  // In production, return a message that code execution is disabled
  if (process.env.NODE_ENV === 'production') {
    return {
      success: false,
      error: 'Code execution is disabled in production for security reasons. Please use the development environment for testing code.',
      output: null
    };
  }

  // Rest of the code execution logic for development...
  // This part won't be reached in production
  return {
    success: false,
    error: 'Code execution not available',
    output: null
  };
};

const runCode = async (code, language, input) => {
  let filePath = null;
  try {
    filePath = await createTempFile(code, language);
    
    // Compilation step for compiled languages
    if (language === 'cpp') {
      await compileCppCode(filePath);
    } else if (language === 'java') {
      await compileJavaCode(filePath);
      // For Java, we need to execute the class file
      const className = path.basename(filePath, '.java');
      const result = await executeCode('java', ['-cp', tempDir, className], input);
      // Clean up Java class file
      await fs.unlink(path.join(tempDir, `${className}.class`)).catch(console.error);
      return result;
    }

    // Execution step
    const config = languageConfigs[language];
    const command = language === 'cpp' ? path.join(process.cwd(), 'a.out') : config.command;
    const args = language === 'python' ? [filePath] : [];
    
    const result = await executeCode(command, args, input);
    return result;
  } catch (error) {
    throw error;
  } finally {
    // Clean up all temporary files
    if (filePath) {
      await fs.unlink(filePath).catch(console.error);
    }
    if (language === 'cpp') {
      await fs.unlink('a.out').catch(console.error);
    }
    // Recreate the bits/stdc++.h file for the next run
    await setupBitsHeader().catch(console.error);
  }
};

// Clean up temp files every hour
setInterval(cleanupTempFiles, 60 * 60 * 1000);

module.exports = {
  runCode,
  cleanupTempFiles,
  executeCode
}; 