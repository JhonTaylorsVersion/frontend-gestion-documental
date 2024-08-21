<?php
header('Content-Type: application/json');

$data = [];
$int = 1;
foreach ($carreras['users'] as $user) {
  if ($user['CAR_CARRERA'] == '1') {
    $padreNombre = '';
    foreach ($carreras['users'] as $padre) {
      if ($padre['CAR_ID'] == $user['CAR_PADREESC']) {
        $padreNombre = $padre['CAR_NOMBRE'];
      }
    }
    $data[] = [
      'USU_ID' => $user['USU_ID'],
      'CAR_ID' => $user['CAR_ID'],
      'CAR_NOMBRE' => $user['CAR_NOMBRE'],
      'CAR_CARRERA' => $user['CAR_NOMBRE'], 
      'CAR_ESCUELA' => $padreNombre,
      'CAR_PADREESC' => $user['CAR_PADREESC'],
      'CAR_ACTIVA' => $user['CAR_ACTIVA'],
      'CAR_ACTIVA_ESCUELA' => $user['CAR_ACTIVA_ESCUELA'],
      'USUCP_TITULACION' => $user['USUCP_TITULACION'],
      'USUCP_EDITAR' => $user['USUCP_EDITAR']
    ];
    $int++;
  }
}

echo json_encode($data);
?>
