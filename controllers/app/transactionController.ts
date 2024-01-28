import { Context } from "../../deps.ts";
import transactionService from "../../services/transaction/transactionService.ts";
import { TransactionSchemaCreate, RequestTransactionSchemaCreate } from '../../schema/transaction/transactionsSchema.ts';
import sharePriceService from "../../services/sharePrice/sharePriceService.ts";
import userService from "../../services/user/userService.ts";
import { SharePriceSchemaUpdate } from "../../schema/sharePrice/sharePricesSchema.ts";
import { UserSchemaWalletUpdate } from "../../schema/user/usersSchema.ts";
import { WalletSharePriceSchemaCreate, WalletSharePriceSchemaUpdate } from "../../schema/sharePrice/walletSharePricesSchema.ts";
import walletSharePriceService from "../../services/sharePrice/walletSharePriceService.ts";
import { SharePriceSchema } from "../../schema/sharePrice/sharePricesSchema.ts";
import { UpdateByIdResponse } from "../../schema/utils/responsesSchema.ts";
import { UserSchema } from "../../schema/user/usersSchema.ts";
import { UpdateByIdSharePriceResponse } from "../../schema/sharePrice/sharePricesSchema.ts";
import { WalletSharePriceSchema } from "../../schema/sharePrice/walletSharePricesSchema.ts";
import { CreateResponse } from "../../schema/utils/responsesSchema.ts";
import { InfoResponse } from "../../schema/utils/responsesSchema.ts";
import getConnectedUser from "../../utils/checkConnectedUser.ts";
import checkHttpMethod from "../../utils/checkHttpMethod.ts";

interface CustomContext extends Context {
    params: {
        [key: string]: string;
    };
}

const TransactionController = {
    async getTransactionByUserId(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['GET'])) {
                return;
            }

            const userId = getConnectedUser(ctx);
            if (!userId) {
                return
            }
            const userTransaction = await transactionService.findByUserId(Number(userId));
            ctx.response.status = userTransaction.httpCode;
            ctx.response.body = {
                success: userTransaction.success,
                message: userTransaction.message,
                transaction: userTransaction.data,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                transaction: null,
            };
        }
    },

    async buySharePrice(ctx: Context) {
        try {
            if (!checkHttpMethod(ctx, ['POST'])) {
                return;
            }

            const userId = await getConnectedUser(ctx);
            if (!userId) {
                return
            }

            const transactionDataRequest: RequestTransactionSchemaCreate = await ctx.request.body().value;
            const typeTransaction = "Achat";

            // On vérifie que l'action existe
            const sharePriceResponse = await sharePriceService.findById(transactionDataRequest.sharePriceId);
            if (!sharePriceResponse.success || sharePriceResponse.data === null) {
                ctx.response.status = sharePriceResponse.httpCode;
                ctx.response.body = {
                    success: sharePriceResponse.success,
                    message: sharePriceResponse.message,
                    sharePrice: sharePriceResponse.data,
                };
                return;
            }

            // On vérifie que l'utilisateur existe
            const userResponse = await userService.findById(userId)
            if (!userResponse.success || userResponse.data === null) {
                ctx.response.status = userResponse.httpCode;
                ctx.response.body = {
                    success: userResponse.success,
                    message: userResponse.message,
                    sharePrice: userResponse.data,
                };
                return;
            }

            // On vérifie que le volume demandé est disponible pour cette action
            if (transactionDataRequest.volume > sharePriceResponse.data.volume) {
                ctx.response.status = 400
                ctx.response.body = {
                    success: false,
                    message: "Pas assez de volume disponible"
                };
                return;
            }

            // On calcul la valeur d'achat
            const buyValue = sharePriceResponse.data?.value * transactionDataRequest.volume;

            // On met à jour le portefeuille de l'utilisateur, cela vérifie qu'il a accès d'argent
            // Cela permet aussi de sauvegarder le nouveau portefeuille de l'utilisateur à condition qu'il ai assez d'argent
            // On envoi une valeur négative dans le cas d'un achat
            const updateUserWallerResponse = await updateWallet(userResponse.data.id, buyValue * -1)
            if (!updateUserWallerResponse.success) {
                ctx.response.status = updateUserWallerResponse.httpCode;
                ctx.response.body = {
                    success: updateUserWallerResponse.success,
                    message: updateUserWallerResponse.message,
                    sharePrice: updateUserWallerResponse.data,
                };
                return;
            }

            // On met à jour la nouvelle action, cela va également stocker dans l'historique de l'action les nouvelles valeurs
            const newSharePriceVolume = sharePriceResponse.data.volume - transactionDataRequest.volume;
            const sharePriceUpdateResponse = await updateSharePrice(sharePriceResponse.data, newSharePriceVolume);

            if (!sharePriceUpdateResponse.success || sharePriceUpdateResponse.sharePriceHistoryId === null) {
                ctx.response.status = sharePriceUpdateResponse.httpCode;
                ctx.response.body = {
                    success: sharePriceUpdateResponse.success,
                    message: sharePriceUpdateResponse.message,
                    sharePrice: sharePriceUpdateResponse.data,
                    sharePriceHistoryId: sharePriceUpdateResponse.sharePriceHistoryId
                };
                return;
            }

            // Recherche si l'utilisateur possède déjà cette action 
            const userWalletSharePriceResponse = await walletSharePriceService.findUserSharePrice(userResponse.data.id, sharePriceResponse.data.id);

            if (userWalletSharePriceResponse.success && userWalletSharePriceResponse.data !== null) {
                // Modifie le volume d'action possèdé par l'utilisateur
                if (typeof userWalletSharePriceResponse.data.volume === "string") {
                    userWalletSharePriceResponse.data.volume = parseFloat(userWalletSharePriceResponse.data.volume);
                }

                const walletSharePriceUpdateResponse = await updateWalletSharePrice(userWalletSharePriceResponse.data, userWalletSharePriceResponse.data.volume + transactionDataRequest.volume)
                if (!walletSharePriceUpdateResponse.success) {
                    ctx.response.status = walletSharePriceUpdateResponse.httpCode;
                    ctx.response.body = {
                        success: walletSharePriceUpdateResponse.success,
                        message: walletSharePriceUpdateResponse.message,
                        walletSharePrice: walletSharePriceUpdateResponse.data,
                    };
                    return;
                }
            } else {
                // Ajoute l'action acheté au portefeuille de l'utilisateur
                const walletSharePriceCreateRequest: WalletSharePriceSchemaCreate = {
                    volume: transactionDataRequest.volume,
                    sharePriceId: sharePriceResponse.data.id,
                    userId: userResponse.data.id
                }
                await walletSharePriceService.create(walletSharePriceCreateRequest);
            }

            // Créer la transaction finale et on l'a renvoi à notre client
            const createdTransaction = await createTransaction(buyValue, transactionDataRequest.volume, typeTransaction, userResponse.data.id, sharePriceUpdateResponse.sharePriceHistoryId);
            ctx.response.status = createdTransaction.httpCode;
            ctx.response.body = {
                success: createdTransaction.success,
                message: createdTransaction.message,
                transaction: createdTransaction.info,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                transaction: null,
            };
        }
    },

    async sellSharePrice(ctx: CustomContext) {
        try {
            if (!checkHttpMethod(ctx, ['POST'])) {
                return;
            }

            const userId = await getConnectedUser(ctx);
            if (!userId) {
                return
            }

            const transactionDataRequest: RequestTransactionSchemaCreate = await ctx.request.body().value;
            const typeTransaction = "Vente";

            // On vérifie que l'action existe
            const sharePriceResponse = await sharePriceService.findById(transactionDataRequest.sharePriceId);
            if (!sharePriceResponse.success || sharePriceResponse.data === null) {
                ctx.response.status = sharePriceResponse.httpCode;
                ctx.response.body = {
                    success: sharePriceResponse.success,
                    message: sharePriceResponse.message,
                    sharePrice: sharePriceResponse.data,
                };
                return;
            }

            // On vérifie que l'utilisateur existe
            const userResponse = await userService.findById(userId)
            if (!userResponse.success || userResponse.data === null) {
                ctx.response.status = userResponse.httpCode;
                ctx.response.body = {
                    success: userResponse.success,
                    message: userResponse.message,
                    sharePrice: userResponse.data,
                };
                return;
            }

            // On récupére le volume d'action possèdé par l'utilisateur
            const userWalletSharePriceResponse = await walletSharePriceService.findUserSharePrice(userResponse.data.id, sharePriceResponse.data.id);
            if (!userWalletSharePriceResponse.success || userWalletSharePriceResponse.data === null) {
                ctx.response.status = userWalletSharePriceResponse.httpCode;
                ctx.response.body = {
                    success: userWalletSharePriceResponse.success,
                    message: userWalletSharePriceResponse.message,
                    sharePrice: userWalletSharePriceResponse.data,
                };
                return;
            }

            // On vérifie que l'utilisateur possède assez de volume
            if (userWalletSharePriceResponse.data.volume < transactionDataRequest.volume) {
                ctx.response.status = 400
                ctx.response.body = {
                    success: false,
                    message: "Pas assez de volume à vendre"
                };
                return;
            }

            // On calcul la valeur de vente
            const sellValue: number = sharePriceResponse.data?.value * transactionDataRequest.volume;
            // On met à jour le portefeuille de l'utilisateur
            // Cela permet aussi de sauvegarder le nouveau portefeuille de l'utilisateur
            const updateUserWallerResponse = await updateWallet(userResponse.data.id, sellValue)
            if (!updateUserWallerResponse.success) {
                ctx.response.status = updateUserWallerResponse.httpCode;
                ctx.response.body = {
                    success: updateUserWallerResponse.success,
                    message: updateUserWallerResponse.message,
                    sharePrice: updateUserWallerResponse.data,
                };
                return;
            }

            // On met à jour la nouvelle action, cela va également stocker dans l'historique de l'action les nouvelles valeurs
            if (typeof sharePriceResponse.data.volume === "string") {
                sharePriceResponse.data.volume = parseFloat(sharePriceResponse.data.volume)
            }
            const newSharePriceVolume: number = sharePriceResponse.data.volume + transactionDataRequest.volume;

            const sharePriceUpdateResponse = await updateSharePrice(sharePriceResponse.data, newSharePriceVolume);

            if (!sharePriceUpdateResponse.success || sharePriceUpdateResponse.sharePriceHistoryId === null) {
                ctx.response.status = sharePriceUpdateResponse.httpCode;
                ctx.response.body = {
                    success: sharePriceUpdateResponse.success,
                    message: sharePriceUpdateResponse.message,
                    sharePrice: sharePriceUpdateResponse.data,
                    sharePriceHistoryId: sharePriceUpdateResponse.sharePriceHistoryId
                };
                return;
            }

            // On met à jour le portefeuille d'action de l'utilisateur avec le nouveau volume possédé 
            const walletSharePriceUpdateResponse = await updateWalletSharePrice(userWalletSharePriceResponse.data, userWalletSharePriceResponse.data.volume - transactionDataRequest.volume)
            if (!walletSharePriceUpdateResponse.success) {
                ctx.response.status = walletSharePriceUpdateResponse.httpCode;
                ctx.response.body = {
                    success: walletSharePriceUpdateResponse.success,
                    message: walletSharePriceUpdateResponse.message,
                    walletSharePrice: walletSharePriceUpdateResponse.data,
                };
                return;
            }

            // Créer la transaction finale et on l'a renvoi à notre client
            const createdTransaction = await createTransaction(sellValue, transactionDataRequest.volume, typeTransaction, userResponse.data.id, sharePriceUpdateResponse.sharePriceHistoryId);
            ctx.response.status = createdTransaction.httpCode;
            ctx.response.body = {
                success: createdTransaction.success,
                message: createdTransaction.message,
                transaction: createdTransaction.info,
            };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                success: false,
                message: error.message,
                transaction: null,
            };
        }
    }
};

async function updateWallet(userId: number, value: number): Promise<UpdateByIdResponse<UserSchema>> {
    const wallet: UserSchemaWalletUpdate = {
        id: userId,
        value: value
    };
    return await userService.updateUserWalletById(wallet);
}

async function updateSharePrice(sharePriceData: SharePriceSchema, newVolume: number): Promise<UpdateByIdSharePriceResponse> {
    if (typeof sharePriceData.value === "string") {
        sharePriceData.value = parseFloat(sharePriceData.value);
    }
    const sharePriceUpdate: SharePriceSchemaUpdate = {
        id: sharePriceData.id,
        name: sharePriceData.name,
        value: calculateNewValue(sharePriceData.value, sharePriceData.volume, newVolume),
        volume: newVolume
    };

    return await sharePriceService.updateById(sharePriceUpdate);
}

async function updateWalletSharePrice(userWalletSharePriceDate: WalletSharePriceSchema, volume: number): Promise<UpdateByIdResponse<WalletSharePriceSchema>> {
    const walletSharePriceUpdateRequest: WalletSharePriceSchemaUpdate = {
        id: userWalletSharePriceDate.id,
        volume: volume
    };
    return await walletSharePriceService.updateVolumeById(walletSharePriceUpdateRequest);
}

async function createTransaction(value: number, volume: number, typeTransaction: string, userId: number, sharePriceHistoryId: number): Promise<CreateResponse<InfoResponse>> {
    // Créer la transaction finale et on l'a renvoi à notre client
    const transactionToCreate: TransactionSchemaCreate = {
        value: value,
        volume: volume,
        typeTransaction: typeTransaction,
        userId: userId,
        sharePriceHistoryId: sharePriceHistoryId
    }
    return await transactionService.create(transactionToCreate);
}

const calculateNewValue = (previousValue: number, previousVolume: number, newVolume: number): number => {
    return parseFloat((previousValue * (previousVolume / newVolume)).toFixed(2));
}

export default TransactionController;

