    const exitSpy = spy(process, "exit");
    let errorWritten = "";
    const originalError = console.error;