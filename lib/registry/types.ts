/**
 * Types and interfaces for plugin management
 */

export interface PluginConfig {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    keywords: string[];
    main: string;
    repository?: {
        type: string;
        url: string;
    };
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    sudaoPlugin?: {
        type: 'component' | 'service' | 'utility';
        category?: string;
        permissions?: string[];
        hooks?: string[];
    };
}

export interface CreatePluginOptions {
    name: string;
    description?: string;
    author?: string;
    type?: 'component' | 'service' | 'utility';
    template?: string;
    directory?: string;
}

export interface PublishOptions {
    registry?: string;
    access?: 'public' | 'restricted';
    tag?: string;
    dryRun?: boolean;
}

export interface InitOptions {
    force?: boolean;
    template?: string;
}

export interface DepsOptions {
    update?: boolean;
    install?: boolean;
    clean?: boolean;
}

export interface PluginTemplate {
    name: string;
    description: string;
    type: 'component' | 'service' | 'utility';
    files: TemplateFile[];
}

export interface TemplateFile {
    path: string;
    content: string;
    isTemplate: boolean;
}

