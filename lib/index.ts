import type { RouteObject } from "react-router-dom";
export interface PluginConfig {
    routes: RouteObject
}

export function defineSUDAOPlugin(config: PluginConfig): PluginConfig {
    return config;
}
