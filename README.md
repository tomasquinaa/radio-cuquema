Store executavel: 

  public function store_(FichaInterventionRequest $request, DWUploadFichaService $service)
    {
        try {
            // Validação dos dados recebidos
            $validatedData = $this->validateFicha($request);

            // Formatar o campo data para o formato correto
            $validatedData['data'] = Carbon::parse($validatedData['data'])->toDateString();

            // Verifica se há um arquivo de imagem e converte para base64
            if ($request->hasFile('original_file')) {
                $image = $request->file('original_file');
                $imageContents = file_get_contents($image->getRealPath());
                // Concatenar a string do tipo de imagem com o base64
                $validatedData['original_file'] = 'data:image/jpeg;base64,' . base64_encode($imageContents);
            }

            // Armazenar os dados localmente
            $ficha = FichaIntervention::create($validatedData);

            if ($ficha) {
                // Gerar o PDF da ficha
                $pdfPath = $this->generateFichaPdf($ficha);

                // Fazer upload para o DocuWare
                $uploadResponse = $this->uploadToDocuWare($service, $request, $pdfPath);

                if (isset($uploadResponse['data']->StatusCode) && $uploadResponse['data']->StatusCode == 422) {
                    return response()->json(['message' => 'Erro: o numero já existe na base de dados', 'error' => $uploadResponse], $uploadResponse['data']->StatusCode);
                }
                if (isset($uploadResponse['data']->StatusCode) && !in_array($uploadResponse['data']->StatusCode, [200, 221])) {
                    return response()->json(['message' => $uploadResponse['data']->Message, 'error' => $uploadResponse], $uploadResponse['data']->StatusCode);
                }
                // dd($uploadResponse);

                if ($uploadResponse['status'] == HttpStatusCode::HTTP_OK) {
                    return response()->json([
                        'message' => 'Ficha armazenada com sucesso e upload feito para o DocuWare',
                        'data' => $ficha
                    ], 200);
                } else {
                    // Se o upload falhar, remover os dados locais e o PDF
                    $ficha->delete();
                    Storage::delete($pdfPath);

                    return response()->json(['message' => 'Erro no upload para o DocuWare, dados removidos', 'error' => $uploadResponse], 500);
                }
            } else {
                return response()->json(['message' => 'Erro ao armazenar os dados localmente'], 500);
            }
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao processar a ficha', 'error' => $th->getMessage()], 500);
        }
    }

    ----------------------------

        public function generateFichaPdf_($ficha)
    {
        //  $data = FichaIntervention::all();

        $fichaPdf = Pdf::loadView('fichaintervencao.intervention_form', [
            'data' => $ficha
        ])->setPaper('a4', 'portrait');

        $pdfPath = storage_path('app/public/fichas/') . 'ficha_' . $ficha->id . '.pdf';
        $fichaPdf->save($pdfPath);

        return $pdfPath;
    }

--------------------------------------------------------------------------------------

<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <meta name="generator" content="Aspose.Words for .NET 24.8.0" />
    <title></title>
    <style type="text/css">
        body {
            font-family: 'Times New Roman';
            font-size: 12pt
        }

        p {
            margin: 0pt
        }

        table {
            margin-top: 0pt;
            margin-bottom: 0pt
        }
    </style>
</head>

<body>

    <div>
        <p class="header">
            <img src="{{ public_path('img/logo.png') }}" width="100" height="100" alt="Logo"
                style="margin-top:4.21pt; margin-left:458pt; position:absolute;" />
            Ficha de Intervenção
        </p>
        <p style="margin-top: 14.7pt; margin-left: 47.7pt; text-align: justify;">
            <span class="contact">Helpdesk contacto:</span>
        </p>
        <p style="margin-left: 31.85pt; line-height: 10.5pt;">
            <span class="ticket-info">Ticket Nº</span>
            <span style="margin-left: 20pt;"></span>
            <span class="ticket-info">Data</span>
            <span style="margin-left: 20pt;"></span>
            <span class="ticket-info">Código Projecto</span>
            <span class="ticket-info">932.896.199</span>
        </p>
        <p style="margin-left: 31.85pt; line-height: 10.5pt;">
            <span class="ticket-info">{{ $data->ticket_num }}</span>
            <span style="margin-left: 20pt;"></span>
            <span class="ticket-info">{{ $data->data }}</span>
            <span style="margin-left: 20pt;"></span>
            <span class="ticket-info">{{ $data->codigo_projeto }}</span>
            <a href="mailto:helpdesk@rcsangola.com" style="text-decoration: none;">
                <span class="contact">helpdesk@rcsangola.com</span>
            </a>
        </p>

        <p style="margin-top:2.6pt; margin-left:12.2pt; text-align:justify; line-height:10.9pt"><span
                style="height:0pt; margin-top:-2.6pt; text-align:left; display:block; position:absolute; z-index:-9"><img
                    src="" width="752" height="136" alt=""
                    style="margin-top:6.34pt; margin-left:-14.85pt; -aw-left-pos:14pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:6.35pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Informações
                Gerais</span></p>
        <p style="margin-top:5.8pt; margin-left:10.4pt; text-align:justify; line-height:11.7pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Técnico: </span><span
                style="font-family:Arial; font-size:10.5pt">{{ $data->tecnico }}</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:61.4pt">
            </span><span style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Cliente:
            </span><span style="font-family:Arial; font-size:10.5pt">{{ $data->cliente }}</span></p>
        <p style="margin-top:3.35pt; margin-left:10.4pt; text-align:justify; line-height:11.7pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Ajudante: </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:180.5pt; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Contacto: </span><span
                style="font-family:Arial; font-size:10.5pt">{{ $data->cliente }}</span></p>
        <p style="margin-top:3.35pt; margin-left:10.4pt; text-align:justify; line-height:11.7pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Motorista: </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:178.15pt; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Telefone: </span></p>
        <p style="margin-top:0.05pt; margin-right:27.5pt; margin-left:10.4pt; line-height:15.8pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Matrícula: </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:179.3pt; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Local: </span><span
                style="font-family:Arial; font-size:10.5pt">{{ $data->cliente }} </span><br><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Atribuido a:
            </span><span style="font-family:Arial; font-size:10.5pt">Samuel Freitas </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:24pt; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Entidade: </span><span
                style="font-family:Arial; font-size:10.5pt">{{ $data->entidade }} </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:24.05pt; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">AgenciaRCS:
            </span><span style="font-family:Arial; font-size:10.5pt">{{ $data->agencia_rcs }} </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:24pt; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Km: </span></p>
        <p style="margin-top:12.95pt; margin-left:12.2pt; text-align:justify; line-height:10.9pt"><span
                style="height:0pt; margin-top:-12.95pt; text-align:left; display:block; position:absolute; z-index:-7"><img
                    src="" width="368" height="128" alt=""
                    style="margin-top:16.57pt; margin-left:273.15pt; -aw-left-pos:302pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:16.57pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="height:0pt; margin-top:-12.95pt; text-align:left; display:block; position:absolute; z-index:-8"><img
                    src="" width="390" height="128" alt=""
                    style="margin-top:16.57pt; margin-left:-14.85pt; -aw-left-pos:14pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:16.57pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Equipamento</span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; letter-spacing:217.25pt; color:#243f5b">
            </span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Durações</span>
        </p>
        <p style="margin-top:4.45pt; margin-right:40.5pt; margin-left:10.4pt; line-height:13.05pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Nome: </span><span
                style="font-family:Arial; font-size:10.5pt">Serviço de Desenvolvimento</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:111.1pt">
            </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Data
                Intervenção: </span><span
                style="font-family:Arial; font-size:8pt; background-color:#d8d8d8">{{ $data->data }}</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:15.05pt; background-color:#d8d8d8">
            </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Nº
                Ticket anterior: </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">ID: </span><span
                style="font-family:Arial; font-size:10.5pt">45</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:33.45pt">
            </span><span style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Contrato:
            </span><span style="font-family:Arial; font-size:10.5pt">RCSASSID-001</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:89.95pt">
            </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Duração
                Ida: </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:75.65pt; background-color:#d8d8d8; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Duração
                Regresso: </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Tipo: </span><span
                style="font-family:Arial; font-size:10.5pt">XXXXXXXX</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:195.15pt">
            </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Hora
                Chegada cliente: </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:38.75pt; background-color:#d8d8d8; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Hora
                Inicio Serviço: </span></p>
        <p style="margin-right:41.55pt; margin-left:10.4pt; text-indent:282.05pt; line-height:10.5pt"><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Hora
                Fim Serviço: </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:55.15pt; background-color:#d8d8d8; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Hora
                Saída cliente: </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Número de série:
            </span><span style="font-family:Arial; font-size:10.5pt">{{ $data->numero_serie }}</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:172.4pt">
            </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Pausa
                almoço: </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:67.45pt; background-color:#d8d8d8; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Rota:
            </span></p>
        <p style="margin-top:1.35pt; margin-left:10.4pt; text-align:justify; line-height:11.7pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Modelo: </span><span
                style="font-family:Arial; font-size:10.5pt">XXXXXXXXX</span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; letter-spacing:173.55pt">
            </span><span
                style="font-family:Arial; font-size:8pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Deslocação:
            </span><span
                style="font-family:Arial; font-size:8pt; background-color:#d8d8d8">{{ $data->categoria_servico }}</span>
        </p>
        <p style="margin-top:7.35pt; margin-left:12.2pt; text-align:justify; line-height:10.9pt"><span
                style="height:0pt; margin-top:-7.35pt; text-align:left; display:block; position:absolute; z-index:-6"><img
                    src="" width="752" height="118" alt=""
                    style="margin-top:11.41pt; margin-left:-14.85pt; -aw-left-pos:14pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:11.42pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Descrição
                Problema</span></p>
        <p style="margin-top:0.95pt; margin-right:131.95pt; margin-left:10.4pt; line-height:17.3pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Desenvolvimento de uma
                solução interna </span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; letter-spacing:112.85pt; -aw-import:spaces">&#xa0;</span><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; text-decoration:underline; color:#243f5b">Origem
                Avaria </span><span style="font-family:Arial; font-size:10.5pt">Implementação do Módulo de Fichas de
                Intervenção - GR Digital (API)</span></p>
        <p style="margin-top:25.75pt; margin-left:12.2pt; text-align:justify; line-height:10.9pt"><span
                style="height:0pt; margin-top:-45.75pt; text-align:left; display:block; position:absolute; z-index:-5"><img
                    src="" width="752" height="114" alt=""
                    style="margin-top:49.83pt; margin-left:-14.85pt; -aw-left-pos:14pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:49.83pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Descrição
                Intervenção</span></p>
        <p style="margin-top:5.05pt; margin-left:9.6pt; text-align:justify; line-height:11.7pt"><span
                style="font-family:Arial; font-size:10.5pt">Criação do layout da ficha de intervenção.</span></p>
        <p style="margin-top:29.3pt; margin-left:12.2pt; text-align:justify; line-height:10.9pt"><span
                style="height:0pt; margin-top:-59.3pt; text-align:left; display:block; position:absolute; z-index:-3"><img
                    src="" width="752" height="116" alt=""
                    style="margin-top:181.85pt; margin-left:-14.85pt; -aw-left-pos:14pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:181.85pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="height:0pt; margin-top:-59.3pt; text-align:left; display:block; position:absolute; z-index:-4"><img
                    src="" width="752" height="154" alt=""
                    style="margin-top:63.85pt; margin-left:-14.85pt; -aw-left-pos:14pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:63.85pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Descrição
                Trabalho</span></p>
        <p style="margin-top:121.8pt; text-align:justify; line-height:1.1pt"><span
                style="font-family:Arial; font-size:1pt; -aw-import:spaces">&#xa0;</span></p>
        <table cellspacing="0" cellpadding="0"
            style="margin-left:9.4pt; -aw-border-insideh:0.5pt single #000000; -aw-border-insidev:0.5pt single #000000; border-collapse:collapse">
            <tr style="height:15.05pt; -aw-height-rule:exactly">
                <td rowspan="2"
                    style="width:108.3pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-left:0.75pt solid #ffffff; border-bottom:0.75pt solid #d8d8d8; padding-right:96.68pt; padding-left:0.38pt; vertical-align:top; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="margin-top:12.55pt; text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Observação
                            técnico:</span></p>
                </td>
                <td
                    style="width:142.7pt; border:0.75pt solid #d8d8d8; padding-right:189.72pt; padding-left:1.08pt; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="margin-top:0.05pt; text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Trabalho
                            resolvido:</span><span
                            style="font-family:Arial; font-size:10.5pt; background-color:#d8d8d8">Não/Sim</span></p>
                </td>
            </tr>
            <tr style="height:15.05pt; -aw-height-rule:exactly">
                <td
                    style="width:174.2pt; border:0.75pt solid #d8d8d8; padding-right:158.22pt; padding-left:1.08pt; vertical-align:top; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="margin-top:2.3pt; text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; background-color:#d8d8d8">Pedido
                            Nova Intervenção:</span><span
                            style="font-family:Arial; font-size:10.5pt; background-color:#d8d8d8">{{ $data->pedido_nova_intervencao }}</span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.05pt; -aw-height-rule:exactly">
                <td
                    style="width:135.1pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #ffffff; border-left:0.75pt solid #ffffff; border-bottom:0.75pt solid #ffffff; padding-right:69.88pt; padding-left:0.38pt; vertical-align:bottom; -aw-border:0.5pt single">
                    <p style="margin-top:0.05pt; line-height:17.3pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Comentário
                            Cliente: Comportamento técnico: </span><span
                            style="font-family:Arial; font-size:10.5pt; -aw-import:spaces">&#xa0;</span></p>
                </td>
                <td
                    style="width:96.65pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #ffffff; border-left:0.75pt solid #ffffff; border-bottom:0.75pt solid #ffffff; padding-right:133.88pt; padding-left:102.98pt; vertical-align:bottom; -aw-border:0.5pt single">
                    <p style="text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic">Satisfação
                            Geral: </span><span
                            style="font-family:Arial; font-size:10.5pt; -aw-import:spaces">&#xa0;</span></p>
                </td>
            </tr>
        </table>
        <p style="margin-top:12.75pt; margin-left:12.2pt; text-align:justify; line-height:10.9pt"><span
                style="height:0pt; margin-top:-12.75pt; text-align:left; display:block; position:absolute; z-index:-1"><img
                    src="" width="180" height="158" alt=""
                    style="margin-top:16.82pt; margin-left:414.15pt; -aw-left-pos:443pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:16.82pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="height:0pt; margin-top:-12.75pt; text-align:left; display:block; position:absolute; z-index:-2"><img
                    src="" width="578" height="158" alt=""
                    style="margin-top:16.82pt; margin-left:-14.85pt; -aw-left-pos:14pt; -aw-rel-hpos:page; -aw-rel-vpos:paragraph; -aw-top-pos:16.82pt; -aw-wrap-type:none; position:absolute" /></span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Peças
                Usadas</span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; letter-spacing:354.4pt; color:#243f5b">
            </span><span
                style="font-family:Arial; font-size:10pt; font-weight:bold; font-style:italic; color:#243f5b">Assinatura</span>
        </p>
        <p style="margin-top:3.25pt; text-align:justify; line-height:1.1pt"><span
                style="font-family:Arial; font-size:1pt; -aw-import:spaces">&#xa0;</span></p>
        <table cellspacing="0" cellpadding="0"
            style="margin-left:9.4pt; border:0.75pt solid #d8d8d8; -aw-border:0.5pt single; -aw-border-insideh:0.5pt single #000000; -aw-border-insidev:0.5pt single #000000; border-collapse:collapse">
            <tr style="height:15.1pt; -aw-height-rule:exactly">
                <td
                    style="width:68pt; border-right:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; padding-right:3.12pt; padding-left:7.48pt; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-right:0.5pt single">
                    <p style="margin-top:0.05pt; text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; background-color:#d8d8d8">Part
                            Number</span></p>
                </td>
                <td
                    style="width:55.2pt; border-right:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; padding-right:102.72pt; padding-left:107.72pt; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single; -aw-border-right:0.5pt single">
                    <p style="margin-top:0.05pt; text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; background-color:#d8d8d8">Descrição</span>
                    </p>
                </td>
                <td
                    style="width:21.58pt; border-right:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; padding-left:1.02pt; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single; -aw-border-right:0.5pt single">
                    <p style="margin-top:0.05pt; text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; background-color:#d8d8d8">Qde</span>
                    </p>
                </td>
                <td
                    style="width:28.42pt; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; padding-left:1.08pt; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single">
                    <p style="margin-top:0.05pt; text-align:justify; line-height:11.7pt"><span
                            style="font-family:Arial; font-size:10.5pt; font-weight:bold; background-color:#d8d8d8">E/R/C</span>
                    </p>
                </td>
            </tr>
            <tr style="height:13.55pt; -aw-height-rule:exactly">
                <td
                    style="width:78.6pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:265.65pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:22.6pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:29.5pt; border-top:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
            </tr>
            <tr style="height:13.5pt; -aw-height-rule:exactly">
                <td
                    style="width:78.6pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:265.65pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:22.6pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:29.5pt; border-top:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
            </tr>
            <tr style="height:13.45pt; -aw-height-rule:exactly">
                <td
                    style="width:78.6pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:265.65pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:22.6pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:29.5pt; border-top:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
            </tr>
            <tr style="height:13.55pt; -aw-height-rule:exactly">
                <td
                    style="width:78.6pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:265.65pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:22.6pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:29.5pt; border-top:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
            </tr>
            <tr style="height:13.5pt; -aw-height-rule:exactly">
                <td
                    style="width:78.6pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:265.65pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:22.6pt; border:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:29.5pt; border-top:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; border-bottom:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-bottom:0.5pt single; -aw-border-left:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
            </tr>
            <tr style="height:12.65pt; -aw-height-rule:exactly">
                <td
                    style="width:78.6pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:265.65pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-left:0.5pt single; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:22.6pt; border-top:0.75pt solid #d8d8d8; border-right:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-left:0.5pt single; -aw-border-right:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
                <td
                    style="width:29.5pt; border-top:0.75pt solid #d8d8d8; border-left:0.75pt solid #d8d8d8; vertical-align:middle; background-color:#d8d8d8; -aw-border-left:0.5pt single; -aw-border-top:0.5pt single">
                    <p style="font-size:12pt"><span style="-aw-import:ignore">&#xa0;</span></p>
                </td>
            </tr>
        </table>
        <p style="margin-top:11.85pt; margin-left:67.7pt; text-align:justify; line-height:11.7pt"><span
                style="font-family:Arial; font-size:10.5pt; font-weight:bold; font-style:italic; color:#243f5b">Exija
                os
                nossos Serviços RCS ANGOLA - Luanda - Lobito - Lubango - Malanje - Soyo</span></p>

    </div>

    <div style="page-break-before: always;">
        {{-- Incluir imagem se existir --}}
        @if ($image)
            <img src="{{ $image }}" alt="Imagem Original" style="max-width: 100%; height: auto;">
        @endif
      
    </div>


</body>

</html>
