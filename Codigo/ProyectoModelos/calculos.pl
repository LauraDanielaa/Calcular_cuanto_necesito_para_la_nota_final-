% Fución que lee las notas y las pasa a calcular 
:- dynamic estudiante/4.

estudiante(juan, bustos, 'juancho1221@gmail.com', xd).
estudiante(daniela, ipus, 'daniela@gmail.com', xd2).
estudiante(ximena, flechas, 'ximena@gmail.com', xd3).


evaluar_notas(Notas, Porcentajes, Resultado) :-
    write('Evaluando notas y porcentajes...'), nl,
    sumador_notas_porcentajes(Notas, Porcentajes, 0, NotasConPorcentajes, TotalPorcentaje),
    (   TotalPorcentaje =< 1
    ->  PorcentajeExamen is 1 - TotalPorcentaje,
        calcular_y_mostrar(NotasConPorcentajes, PorcentajeExamen, Resultado)
    ;   Resultado = 'Error: La suma de los porcentajes no puede ser mayor a 1.'
    ).

% Suma los porcentajes y construye la lista de tuplas [(Nota, Porcentaje)]
sumador_notas_porcentajes([], [], TotalPorcentaje, [], TotalPorcentaje).
sumador_notas_porcentajes([Nota|RestoNotas], [Porcentaje|RestoPorcentajes], Acumulado, [(Nota, Porcentaje)|NotasFinal], Total) :-
    NuevoTotal is Acumulado + Porcentaje,
    sumador_notas_porcentajes(RestoNotas, RestoPorcentajes, NuevoTotal, NotasFinal, Total).
 
% Valida que la ponderación esté en el rango [0, 1]
validar_porcentajes(Notas, Porcentaje) :-
    (   Porcentaje >= 0, Porcentaje =< 1, 
        Notas >= 0, Notas =< 5 
    ->  true
    ;   throw(error(numero_negativo_noValido))
    ).

% Cálculos y mostrar resultados
calcular_y_mostrar(Notas, PorcentajeExamen, NotaFinal) :-
    nota_final(Notas, NotaActual),
    format('\nNota actual acumulada: ~2f', [NotaActual]), nl,
    NotaFinal is (3.0 - NotaActual) / PorcentajeExamen.


% Cálculo de nota final acumulada
nota_final([], 0).
nota_final([(N, P)|Resto], Suma) :-
    nota_final(Resto, SumaResto),
    Suma is SumaResto + (N * P).