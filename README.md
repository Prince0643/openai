# Omni Gym Chat Automation System

This system integrates OpenAI Assistant with ManyChat and GymMaster API to provide automated chat responses for gym-related inquiries. The system handles the complete flow where OpenAI threads, answers, and GymMaster processes are all handled within this system, and then the OpenAI answers are passed back to Make.com.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`

3. Start the server:
   ```bash
   node openaitomanychat.js
   ```

4. Expose to internet:
   ```bash
   npx localtunnel --port 3000
   ```

## Documentation

For complete documentation, see [DOCUMENTATION.md](DOCUMENTATION.md)

For specific Make.com integration instructions, see [HOW_TO_CONNECT_TO_MAKE.md](HOW_TO_CONNECT_TO_MAKE.md) or the detailed guide [MAKE_COM_INTEGRATION_DETAILED.md](MAKE_COM_INTEGRATION_DETAILED.md)

For troubleshooting Make.com 500 errors, see [MAKE_COM_500_ERROR_SOLUTION.md](MAKE_COM_500_ERROR_SOLUTION.md)

For confirmation that GymMaster and OpenAI integrations are working, see [CONFIRMATION_TESTS_PASSED.md](CONFIRMATION_TESTS_PASSED.md)

For deployment to Render, see [DEPLOY_TO_RENDER.md](DEPLOY_TO_RENDER.md)

For OpenAI Assistant configuration, see [ASSISTANT_CONFIGURATION.md](ASSISTANT_CONFIGURATION.md) and [ASSISTANT_SETUP_SUMMARY.md](ASSISTANT_SETUP_SUMMARY.md)

## System Status

Check if your system is running correctly:
```bash
curl http://localhost:3000/health
```

## Environment Variables

See `.env` file for required configuration.

## License

This project is proprietary and confidential.