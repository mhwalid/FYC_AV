import { config, ensureDir, format, join } from "../deps.ts";

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

export async function logToFile(
  level: LogLevel,
  message: string,
): Promise<void> {
  try {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd-MM-yyyy HH:mm");
    const log =
      `${formattedDate} [${level}] - ${message} - Source: ${mainModulePath}\n`;

    let logFile = "";
    switch (level) {
      case LogLevel.ERROR:
        logFile = "error_logs.txt";
        break;
      case LogLevel.INFO:
        logFile = "info_logs.txt";
        break;
      case LogLevel.CONNECTION:
        logFile = "connection_logs.txt";
        break;
      case LogLevel.DEBUG:
        logFile = "debug_logs.txt";
        break;
      case LogLevel.WARNING:
        logFile = "warning_logs.txt";
        break;
      default:
        console.error("Niveau de log non pris en charge:", level);
        return;
    }

    // Création du dossier
    const logFolderPath = join(LOGS_PATH, level.toLowerCase());
    await ensureDir(logFolderPath);

    // Création du fichier
    const logFilePath = join(
      logFolderPath,
      `${format(currentDate, "ddMMyyyy")}_${logFile}`,
    );
    const file = await Deno.open(logFilePath, {
      create: true,
      append: true,
      write: true,
    });

    // Écriture dans le fichier
    await Deno.write(file.rid, encoder.encode(log));

    // Fermeture du fichier
    Deno.close(file.rid);
  } catch (error) {
    console.error("Erreur lors de l'écriture dans le fichier de logs:", error);
  }
}
