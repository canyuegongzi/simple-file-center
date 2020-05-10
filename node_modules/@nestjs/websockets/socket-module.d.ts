import { Injectable } from '@nestjs/common/interfaces/injectable.interface';
import { ApplicationConfig } from '@nestjs/core/application-config';
import { NestContainer } from '@nestjs/core/injector/container';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
export declare class SocketModule<HttpServer = any> {
    private readonly socketsContainer;
    private applicationConfig;
    private webSocketsController;
    private isAdapterInitialized;
    private httpServer;
    register(container: NestContainer, config: ApplicationConfig, httpServer?: HttpServer): void;
    combineAllGateways(providers: Map<string, InstanceWrapper<Injectable>>, moduleName: string): void;
    combineGatewayAndServer(wrapper: InstanceWrapper<Injectable>, moduleName: string): void;
    close(): Promise<any>;
    private initializeAdapter;
    private getContextCreator;
}
