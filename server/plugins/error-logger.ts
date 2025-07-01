export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', async (error, { event }) => {
    // Log the error with more context
    console.error(
      `[Nitro Error] At path: ${event ? event.path : 'N/A'}.`,
      `\nError message: ${error.message}`,
      `\nStacktrace:`, error.stack
    );
  });

  console.log('✅ Nitro error-logger plugin loaded.');
}); 