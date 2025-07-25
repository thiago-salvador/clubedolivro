import React from 'react';
import { FileText, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import SwaggerUI from '../../components/admin/SwaggerUI';

const ApiDocs: React.FC = () => {
  const navigate = useNavigate();

  const handleDownloadJSON = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(require('../../api/swagger.json'), null, 2)], {
      type: 'application/json'
    });
    element.href = URL.createObjectURL(file);
    element.download = 'clube-do-livro-api-swagger.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPostman = () => {
    // Converter Swagger para formato Postman Collection
    const swagger = require('../../api/swagger.json');
    
    interface PostmanRequest {
      name: string;
      request: {
        method: string;
        header: Array<{ key: string; value: string }>;
        url: {
          raw: string;
          host: string[];
          path: string[];
        };
        body?: {
          mode: string;
          raw: string;
        };
      };
    }
    
    interface PostmanFolder {
      name: string;
      item: PostmanRequest[];
    }
    
    interface PostmanCollection {
      info: {
        name: string;
        description: string;
        schema: string;
      };
      item: PostmanFolder[];
    }

    const postmanCollection: PostmanCollection = {
      info: {
        name: swagger.info.title,
        description: swagger.info.description,
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: []
    };

    // Converter paths para requests do Postman
    Object.entries(swagger.paths).forEach(([path, methods]: [string, any]) => {
      const folder: PostmanFolder = {
        name: path,
        item: []
      };

      Object.entries(methods).forEach(([method, spec]: [string, any]) => {
        if (spec.tags) {
          const request: PostmanRequest = {
            name: spec.summary || `${method.toUpperCase()} ${path}`,
            request: {
              method: method.toUpperCase(),
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              url: {
                raw: `{{baseUrl}}${path}`,
                host: ["{{baseUrl}}"],
                path: path.split('/').filter((p: string) => p)
              }
            }
          };

          // Adicionar autenticação se necessário
          if (spec.security && spec.security.length > 0) {
            request.request.header.push({
              key: "Authorization",
              value: "Bearer {{token}}"
            });
          }

          // Adicionar body se houver
          if (spec.requestBody) {
            request.request.body = {
              mode: "raw",
              raw: JSON.stringify(
                spec.requestBody.content['application/json'].schema.properties || {},
                null,
                2
              )
            };
          }

          folder.item.push(request);
        }
      });

      if (folder.item.length > 0) {
        postmanCollection.item.push(folder);
      }
    });

    // Download do arquivo
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(postmanCollection, null, 2)], {
      type: 'application/json'
    });
    element.href = URL.createObjectURL(file);
    element.download = 'clube-do-livro-api-postman.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-terracota transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-terracota/10 rounded-lg">
                <FileText className="w-6 h-6 text-terracota" />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-marrom-escuro dark:text-bege-claro">
                  Documentação da API
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Swagger OpenAPI 3.0
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Swagger JSON</span>
            </button>
            <button
              onClick={handleDownloadPostman}
              className="flex items-center gap-2 px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Postman Collection</span>
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-marrom-escuro dark:text-bege-claro mb-2">
              Base URL
            </h3>
            <code className="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              /api/v1
            </code>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-marrom-escuro dark:text-bege-claro mb-2">
              Autenticação
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bearer Token JWT
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-marrom-escuro dark:text-bege-claro mb-2">
              Rate Limiting
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              100 requests / 15 min
            </p>
          </div>
        </div>

        {/* Swagger UI */}
        <SwaggerUI />

        {/* Footer Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Notas Importantes
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Esta é uma API simulada para desenvolvimento frontend</li>
            <li>• Os dados são armazenados localmente no navegador</li>
            <li>• Em produção, substituir pelos endpoints reais do backend</li>
            <li>• Todos os endpoints requerem autenticação, exceto login e registro</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApiDocs;