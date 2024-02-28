# Semester3-MidtermSprint-JavaScript

Best Kind Brewery Command Line Interface
This CLI aids in the configuration and system administration needed for BK Brewery’s rewards program. It encompasses a variety of functionalities including initialization, configuration management, and token generation through the terminal interface. It also generates tokens for new users through a web form. All major events (successes and errors) are saved to a logs folder to provide feedback on the health and performance of the full-stack application. 

** USAGE **
Node bkbrewery <command> <option>


** COMMANDS ** 
•	--help: Display all commands for the BKBrewery CLI  

init: 
Initialize the CLI and set up necessary configurations.
•	--help: Display all init commands 
•	--all: Create the full web applications directory structure (folders) and config, tokens files with default settings 
•	--mk: Create the full web applications directory structure (folders) 
•	--cat: Create config and tokens file with default settings 

config:
Manage configuration settings.
•	--help: Display all config commands 
•	--show: Display current config settings.
•	--reset: Reset config file to default settings.
•	--set <key> <value>: Set a specific config setting.

token:
Handle token generation and management for users.
•	--help: Display all token commands 
•	--count: Display count of generated tokens.
•	--new <username> <email> <phone>: Generate a token for a given user and save it.
•	--upd p <username> <phone>: Update a user's phone number.
•	--upd e <username> <email>: Update a user's email.
•	--search u <username>: Fetch a token for a given username.
•	--search e <email>: Fetch a token for a given email.
•	--search p <phone>: Fetch a token for a given phone number.


Logging Structure Summary:
The logging structure in this code is designed to organize log events into files stored within a logs directory. 
Each log event includes the following information:
•	Date and Time: The timestamp of the log event in the format yyyyMMdd HH:mm:ss.
•	Log Level: Indicates the severity level of the event (e.g., INFO, WARNING, ERROR).
•	Event: Describes the type or category of the event.
•	Message: Provides additional details or context about the event.
•	UUID: Universally unique identifier for the log event.


