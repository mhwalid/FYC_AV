import { config, format } from "../deps.ts";

const errorLogFile = "error_logs.txt";
const infoLogFile = "info_logs.txt";
const debugLogFile = "debug_logs.txt";
const warningLogFile = "warning_logs.txt";
const connectionLogFile = "connection_logs.txt";

const encoder = new TextEncoder();

const env = config();
const { LOGS_PATH } = env;

export enum LogLevel {
  ERROR = "ERROR",
  INFO = "INFO",
  CONNECTION = "CONNECTION",
  DEBUG = "DEBUG",
  WARNING = "WARNING",
}

const mainModulePath = Deno.mainModule;

export async function logToFile(level: LogLevel, message: string): Promise<void> {
  try {
    const formattedDate = format(new Date(), "dd-MM-yyyy HH:mm");
    const log = `${formattedDate} [${level}] - ${message} - Source: ${mainModulePath}\n`;

    let logFile = "";
    switch (level) {
      case LogLevel.ERROR:
        logFile = errorLogFile;
        break;
      case LogLevel.INFO:
        logFile = infoLogFile;
        break;
      case LogLevel.CONNECTION:
        logFile = connectionLogFile;
        break;
      case LogLevel.DEBUG:
        logFile = debugLogFile;
        break;
      case LogLevel.WARNING:
        logFile = warningLogFile;
        break;
      default:
        console.error("Niveau de log non pris en charge:", level);
        return;
    }

    // Ouverture du fichier
    const file = await Deno.open(LOGS_PATH + logFile, { create: true, append: true, write: true });

    // Écriture dans le fichier
    await Deno.write(file.rid, encoder.encode(log));

    // Fermeture du fichier
    Deno.close(file.rid);
  } catch (error) {
    console.error("Erreur lors de l'écriture dans le fichier de logs:", error);
  }
}
