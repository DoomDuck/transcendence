import { io } from 'socket.io-client';
import { goto } from '$app/navigation';
import type { ChatSocket } from '$lib/utils';
import { LoginEvent } from 'backFrontCommon';

const LOGGIN_ROUTE : string = "/";
const LOGGIN_TOTP_ROUTE : string = "/totp";
const LOGGIN_SUCCESS_ROUTE : string = "/Main";

class State {
    private safeSocket : ChatSocket | null = null;
    private requiresTotp: boolean = false;
    
    get socket() : ChatSocket {
        if (!this.safeSocket)
            throw new Error("Socket not initialized");
        return this.safeSocket
    }
    
    get connected() : boolean {
        return !!this.safeSocket;
    }
    
    connect(code?: string) {
        if (this.connected)
            throw new Error("Allready connected");
	    this.safeSocket = io('http://localhost:5000/chat', { auth: { code } });
        this.setupHooks();
        if (!code)
            goto(LOGGIN_SUCCESS_ROUTE);
    }

    setupHooks() {
        this.socket.once('connect_error', this.onConnectError.bind(this));
        this.socket.once('disconnect', this.onDisconnect.bind(this))
        this.socket.once(LoginEvent.TOTP_REQUIREMENTS, this.onTotpRequirements.bind(this));
        this.socket.once(LoginEvent.TOTP_RESULT, this.onTotpResult.bind(this));
    }
    
    disconnect() {
        if (!this.connected)
            throw new Error("Not connected");
        this.socket.disconnect();
        this.safeSocket = null;
    }
    
    sendTotpToken(token: string) {
        this.socket.emit(LoginEvent.TOTP_CHECK, token);
    }
    
    // Hooks
    onConnectError() {
        // Clean close
        this.onDisconnect();
    }

    onDisconnect() {
        this.safeSocket = null;
        goto(LOGGIN_ROUTE);
    }
    
    onTotpRequirements(isRequired: boolean) {
        this.requiresTotp = isRequired;
        goto(isRequired ? LOGGIN_TOTP_ROUTE : LOGGIN_SUCCESS_ROUTE);
    }
    
    onTotpResult(success: boolean) {
        console.log(`totp result ${success}`);
        goto(success ? LOGGIN_SUCCESS_ROUTE : LOGGIN_ROUTE);
    }
    
    // Use in +layout.svelte
    forceRoute() : string | null {
        if (!this.connected) return LOGGIN_ROUTE;
        if (this.requiresTotp) return LOGGIN_TOTP_ROUTE;
        return null;
    }
}

export const state = new State();



