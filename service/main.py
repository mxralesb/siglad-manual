from fastapi import FastAPI
from pydantic import BaseModel
import base64, cv2, numpy as np
from ultralytics import YOLO

app = FastAPI()
model = YOLO("yolov8n.pt")

LIMITS = {
  "cabezal_furgon": {"alto_m": 4.8, "ancho_m": 3.1},
  "camion_rigido":  {"alto_m": 4.8, "ancho_m": 3.1},
  "plataforma":     {"alto_m": 4.8, "ancho_m": 3.1},
}

class Payload(BaseModel):
  image_base64: str
  vehiculo_tipo: str

def aruco_scale(img):
  aruco = cv2.aruco
  dict_ = aruco.getPredefinedDictionary(aruco.DICT_4X4_50)
  params = aruco.DetectorParameters()
  corners, ids, _ = aruco.detectMarkers(img, dict_, parameters=params)
  if ids is None or len(ids)==0:
    return None
  pix = cv2.norm(corners[0][0][0]-corners[0][0][2])
  return 0.20 / pix

@app.post("/analyze")
def analyze(p: Payload):
  arr = np.frombuffer(base64.b64decode(p.image_base64), dtype=np.uint8)
  img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
  scale = aruco_scale(img)
  res = model(img, imgsz=960, conf=0.25, verbose=False)[0]
  if not res.boxes:
    return {"resultado":"OBSERVADO","motivos":["no_detection"],"limite_alto_m":LIMITS[p.vehiculo_tipo]["alto_m"],"limite_ancho_m":LIMITS[p.vehiculo_tipo]["ancho_m"]}
  boxes = res.boxes.xyxy.cpu().numpy().astype(int)
  x1,y1,x2,y2 = max(boxes, key=lambda b:(b[3]-b[1]))
  if scale is None:
    return {"resultado":"OBSERVADO","motivos":["no_scale_marker"],"alto_m":None,"ancho_m":None,"limite_alto_m":LIMITS[p.vehiculo_tipo]["alto_m"],"limite_ancho_m":LIMITS[p.vehiculo_tipo]["ancho_m"]}
  alto_m = (y2-y1)*scale
  ancho_m = (x2-x1)*scale
  limites = LIMITS[p.vehiculo_tipo]
  motivos = []
  if alto_m > limites["alto_m"] + 0.05:
    motivos.append("excede_altura")
  if ancho_m > limites["ancho_m"] + 0.05:
    motivos.append("excede_ancho")
  resultado = "APROBADO" if not motivos else "OBSERVADO"
  return {
    "resultado":resultado,
    "motivos":motivos,
    "alto_m":float(alto_m),
    "ancho_m":float(ancho_m),
    "limite_alto_m":float(limites["alto_m"]),
    "limite_ancho_m":float(limites["ancho_m"]),
    "regla_fuente":"GT"
  }
