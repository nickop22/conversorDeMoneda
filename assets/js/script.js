document.addEventListener('DOMContentLoaded', function() {
    const botonConvertir = document.getElementById('boton-convertir')
    const cantidadInput = document.getElementById('cantidad')
    const monedaSeleccionada = document.getElementById('moneda-seleccionada')
    const resultadoConvertido = document.getElementById('resultado-convertido')
    const ctx = document.getElementById('miGrafico').getContext('2d')
    let grafico;

    botonConvertir.addEventListener('click', async function() {
        const cantidad = parseFloat(cantidadInput.value)
        const moneda = monedaSeleccionada.value
        
        if (isNaN(cantidad) || cantidad <= 0) {
            alert('Por favor, ingrese una cantidad válida en CLP.')
            return;
        }

        try {
            const response = await fetch('https://mindicador.cl/api')
            const data = await response.json()
            
            let tasaCambio;
            if (moneda === 'dolar') {
                tasaCambio = data.dolar.valor;
            } else if (moneda === 'euro') {
                tasaCambio = data.euro.valor;
            } else if (moneda === 'uf') {
                tasaCambio = data.uf.valor;
            }

            const cantidadConvertida = cantidad / tasaCambio
            resultadoConvertido.textContent = cantidadConvertida.toFixed(2)

            const responseMoneda = await fetch(`https://mindicador.cl/api/${moneda}`)
            const dataMoneda = await responseMoneda.json()

            const ultimos10 = dataMoneda.serie.slice(0, 10).reverse()
            const etiquetas = ultimos10.map(item => new Date(item.fecha).toLocaleDateString())
            const valores = ultimos10.map(item => item.valor)

            if (grafico) {
                grafico.destroy()
            }

            grafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: etiquetas,
                    datasets: [{
                        label: `Valor del ${moneda.toUpperCase()}`,
                        data: valores,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Fecha'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Valor'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            alert('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.');
        }
    });
});
