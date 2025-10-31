import os

def analyze_project(project_path):
    print(f"Analisando o projeto em: {project_path}")
    if not os.path.exists(project_path):
        print("Erro: O caminho do projeto não existe.")
        return

    print("Conteúdo do diretório:")
    for root, dirs, files in os.walk(project_path):
        level = root.replace(project_path, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f'{subindent}{f}')

if __name__ == "__main__":
    project_path = input("Por favor, insira o caminho absoluto para o seu projeto Vercel: ")
    analyze_project(project_path)

# C:\repositorios\rbnails\rbnails
# python analyzeVercelManus.py