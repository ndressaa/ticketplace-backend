#!/bin/bash

## Use esse script para executar qualquer ação após a compilação do projeto.

# Paths de origem e destino
source_path="../src/"
destination_path="../dist/"
script_dir=$(dirname "$(readlink -f "$0")")

# Cria o diretório de destino se não existir
mkdir -p "$(dirname "$script_dir/$destination_path")"
