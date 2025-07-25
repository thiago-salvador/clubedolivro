import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code, FileText, Lock } from 'lucide-react';
import swaggerSpec from '../../api/swagger.json';

interface SwaggerUIProps {}

const SwaggerUIComponent: React.FC<SwaggerUIProps> = () => {
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const togglePath = (path: string) => {
    setExpandedPaths(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const getMethodColor = (method: string) => {
    const colors = {
      get: 'bg-blue-500',
      post: 'bg-green-500',
      put: 'bg-orange-500',
      delete: 'bg-red-500',
      patch: 'bg-purple-500'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-500';
  };

  const renderParameters = (parameters: any[]) => {
    if (!parameters || parameters.length === 0) return null;

    return (
      <div className="mt-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parameters:</h4>
        <div className="space-y-2">
          {parameters.map((param, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-terracota">{param.name}</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  {param.in}
                </span>
                {param.required && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    required
                  </span>
                )}
              </div>
              {param.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {param.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRequestBody = (requestBody: any) => {
    if (!requestBody) return null;

    return (
      <div className="mt-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Request Body:</h4>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {requestBody.description}
          </p>
          <div className="mt-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              application/json
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderResponses = (responses: any) => {
    return (
      <div className="mt-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Responses:</h4>
        <div className="space-y-2">
          {Object.entries(responses).map(([code, response]: [string, any]) => (
            <div key={code} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm px-2 py-1 rounded text-white ${
                  code.startsWith('2') ? 'bg-green-500' :
                  code.startsWith('4') ? 'bg-orange-500' :
                  code.startsWith('5') ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {code}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {response.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-marrom-escuro dark:text-bege-claro">
              {swaggerSpec.info.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {swaggerSpec.info.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            <span>OpenAPI {swaggerSpec.openapi}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Base URL: /api/v1</span>
          </div>
        </div>
      </div>

      {/* API Paths */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Object.entries(swaggerSpec.paths).map(([path, methods]: [string, any]) => (
          <div key={path} className="p-4">
            <button
              onClick={() => togglePath(path)}
              className="flex items-center gap-2 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
            >
              {expandedPaths.includes(path) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <code className="font-mono text-sm text-terracota font-semibold">{path}</code>
            </button>

            {expandedPaths.includes(path) && (
              <div className="mt-3 ml-6 space-y-3">
                {Object.entries(methods).map(([method, spec]: [string, any]) => {
                  const methodKey = `${method}-${path}`;
                  const isExpanded = selectedMethod === methodKey;

                  return (
                    <div key={method} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setSelectedMethod(isExpanded ? null : methodKey)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${getMethodColor(method)} text-white text-xs font-bold px-3 py-1 rounded uppercase min-w-[60px] text-center`}>
                            {method}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                            {spec.summary || `${method.toUpperCase()} ${path}`}
                          </span>
                          {spec.security && spec.security.length > 0 && (
                            <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              <Lock className="w-3 h-3" />
                              <span>Auth</span>
                            </div>
                          )}
                        </div>
                        {spec.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                            {spec.description}
                          </p>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-white dark:bg-gray-800">
                          {renderParameters(spec.parameters)}
                          {renderRequestBody(spec.requestBody)}
                          {renderResponses(spec.responses)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwaggerUIComponent;