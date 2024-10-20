"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueControllerOverride = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaDialogueController_1 = require("../../controllers/FikaDialogueController");
const Override_1 = require("../../di/Override");
let DialogueControllerOverride = class DialogueControllerOverride extends Override_1.Override {
    fikaDialogueController;
    constructor(fikaDialogueController) {
        super();
        this.fikaDialogueController = fikaDialogueController;
    }
    execute(container) {
        container.afterResolution("DialogueController", (_t, result) => {
            result.getFriendList = (sessionID) => {
                return this.fikaDialogueController.getFriendList(sessionID);
            };
            result.sendMessage = (sessionId, request) => {
                return this.fikaDialogueController.sendMessage(sessionId, request);
            };
        }, { frequency: "Always" });
    }
};
exports.DialogueControllerOverride = DialogueControllerOverride;
exports.DialogueControllerOverride = DialogueControllerOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaDialogueController")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaDialogueController_1.FikaDialogueController !== "undefined" && FikaDialogueController_1.FikaDialogueController) === "function" ? _a : Object])
], DialogueControllerOverride);
//# sourceMappingURL=DialogueController.js.map