function kernel(context, middleware, index) {
    const nextMiddleware = middleware[index];

    if (!nextMiddleware) {
        return context.next;
    }

    return () => {
        const nextPipeline = kernel(
            context, middleware, index + 1,
        );

        nextMiddleware({ ...context, next: nextPipeline });
    };
}

export default kernel;
