## Setup

1. Create a `.env` file in the root directory and enter the following environment variables:
   ```env
   TOKEN=<discord bot token>
   CLIENT_ID=<bot client id>
   GUILD_ID=<discord server id>
   SPREADSHEET_ID=<google sheets id>
   CALENDAR_ID=<google calendar id>
   SYNC_ID=<id of the channel to receive weekly sync pings>
   ANNOUNCEMENT_ID=<id of the channel to receive announcements>
   PING_ROLE_IDS=<id of roles to ping (space separated)>

   URL=<API endpoint url>
   UUID=<UUID>
   PORT=<PORT>
   ```

2. Run the command
   ```sh
   npm start
   ```
