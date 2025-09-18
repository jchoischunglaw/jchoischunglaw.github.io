# Lab2Dent Project Error Report

## ESLint Errors

### 1. React no-unescaped-entities Error
- **File**: `src/app/unauthorized/page.tsx:9:50`
- **Description**: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.
- **Solution**: Escape quotes with HTML entities

### 2. TypeScript no-unused-vars Error  
- **File**: `src/lib/auth.ts:39:23`
- **Description**: `'_'` is assigned a value but never used.
- **Solution**: Remove unused variable `_` or disable ESLint rule

## TypeScript Compilation Errors
- TypeScript type checking result: **No errors found**

## Summary
- Total of 2 ESLint errors found
- No TypeScript compilation errors
- All errors are code quality warnings