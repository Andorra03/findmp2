export interface BridgeWindow extends Window {
    [API_KEY.OPEN_DIRECTORY]: () => Promise<string[]>
    [API_KEY.ANALYZE_SINGLE_PACKAGE]: (packagePath: string) => Promise<DetectPackageResult>
    [API_KEY.READ_FILE_BY_LINE]: (filePath: string, startLine: number, endLine: number) => Promise<string | undefined>
    [API_KEY.ANALYZE_DIRECTORY]: (dirPath: string) => Promise<DetectPackageResult[]>
    [API_KEY.UPDATE_PACKAGE_NUMBER]: (callback: (e: any, total: number) => void) => void
    [API_KEY.UPDATE_DETECT_PROGRESS]: (callback: (e: any) => void) => void
}

export enum API_KEY {
    OPEN_DIRECTORY = 'openDirectory',
    ANALYZE_SINGLE_PACKAGE = 'analyzeSinglePackage',
    READ_FILE_BY_LINE = 'readFileByLine',
    ANALYZE_DIRECTORY = 'analyzeDirectory',
    UPDATE_PACKAGE_NUMBER = 'updatePackageNumber',
    UPDATE_DETECT_PROGRESS = 'updateDetectProgress',
}

export interface Record {
    filePath: string
    content: {
        start: {
            line: number
            column: number
        }
        end: {
            line: number
            column: number
        }
    } | string
}

export interface PackageFeatureInfo {
    hasInstallScripts: boolean
    containIP: boolean
    useBase64Conversion: boolean
    useBase64ConversionInInstallScript: boolean
    containBase64StringInJSFile: boolean
    containBase64StringInInstallScript: boolean
    containDomainInJSFile: boolean
    containDomainInInstallScript: boolean
    containBytestring: boolean
    useBuffer: boolean
    useEval: boolean
    requireChildProcessInJSFile: boolean
    requireChildProcessInInstallScript: boolean
    accessFSInJSFile: boolean
    accessFSInInstallScript: boolean
    accessNetworkInJSFile: boolean
    accessNetworkInInstallScript: boolean
    accessProcessEnvInJSFile: boolean
    accessProcessEnvInInstallScript: boolean
    accessCryptoAndZip: boolean
    accessSensitiveAPI: boolean
    containSuspiciousString: boolean
    installCommand: string[]
    executeJSFiles: string[]
    packageName: string
    version: string
}

type RecordFeatureInfo = Omit<PackageFeatureInfo, 'containBase64StringInJSFile' | 'containBase64StringInInstallScript' | 'installCommand' | 'executeJSFiles' | 'packageName' | 'version'>

export interface PackageMetaData {
    packageName: string
    version: string
    packageSize: number
}

export interface DetectPackageResult {
    metaData?: PackageMetaData
    packagePath: string
    isMalicious?: boolean
    success: boolean
    featurePosSet?: {
        [k in keyof RecordFeatureInfo]: Record[]
    }
    errorMessage?: string
}

export enum PagePath {
    ROOT_PATH = '/',
    WELCOME = '/pages/DetectDirectory/',
    SYSTEM_PERFORMANCE = '/',
    DETECT_SINGLE_PACKAGE = '/detect/single',
    DETECT_DIRECTORY = '/detect/directory',
    RESULT_DETAIL = '/result/single',
    RESULT_LIST = '/result/list',
}
