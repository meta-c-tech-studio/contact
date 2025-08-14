class TestCaseValidator {
    validateTestCases(output, testCases) {
        console.log("=== VALIDATION START ===")
        console.log("Raw output:", JSON.stringify(output))
        console.log("Test cases:", testCases)

        if (!output || output.trim() === "") {
            console.log("No output detected - marking as failed")
            return {
                accepted: false,
                passedTests: 0,
                totalTests: testCases.length,
                results: testCases.map((testCase, index) => ({
                    testCase: index + 1,
                    input: testCase.input,
                    expected: testCase.expectedOutput,
                    actual: "(no output)",
                    passed: false,
                    description: testCase.description,
                })),
                error: "No output produced. Make sure your function works correctly.",
            }
        }

        // Split output into lines
        const outputLines = output
            .trim()
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "")

        console.log("Output lines:", outputLines)

        const results = []
        let passedTests = 0

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i]
            const actualOutput = outputLines[i] || "(missing)"
            const expectedOutput = testCase.expectedOutput.trim()

            // Simple comparison - remove spaces and quotes
            const normalizeOutput = (str) => str.replace(/[\s"']/g, "").toLowerCase()

            const normalizedActual = normalizeOutput(actualOutput)
            const normalizedExpected = normalizeOutput(expectedOutput)

            const passed = normalizedActual === normalizedExpected && normalizedActual.length > 0

            console.log(`Test ${i + 1}:`)
            console.log(`  Expected: "${expectedOutput}" -> "${normalizedExpected}"`)
            console.log(`  Actual: "${actualOutput}" -> "${normalizedActual}"`)
            console.log(`  Passed: ${passed}`)

            results.push({
                testCase: i + 1,
                input: testCase.input,
                expected: expectedOutput,
                actual: actualOutput,
                passed: passed,
                description: testCase.description,
            })

            if (passed) {
                passedTests++
            }
        }

        const finalResult = {
            accepted: passedTests === testCases.length && passedTests > 0,
            passedTests,
            totalTests: testCases.length,
            results,
            error: passedTests === 0 ? "All test cases failed. Check your implementation." : null,
        }

        console.log("Final result:", finalResult)
        console.log("=== VALIDATION END ===")

        return finalResult
    }
}

export default new TestCaseValidator()
