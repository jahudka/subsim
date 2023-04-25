import { FC, useState } from 'react';
import { HiOutlineDownload } from 'react-icons/hi';
import { EngineInterface } from '../../engine';
import { BooleanField } from '../fields';
import { useEngine } from '../stateProvider';
import { sanitizeFileName } from './utils';

export type ExportImageProps = {
  projectName: string;
  close: () => void;
};

type SupportedFormat = [type: string, quality?: number];
const supportedFormats = resolveSupportedFormats();

export const ExportImage: FC<ExportImageProps> = ({ projectName, close }) => {
  const [ui, setUi] = useState(true);
  const [legend, setLegend] = useState(true);
  const engine = useEngine();

  return (
    <>
      <div className="row">
        <div className="text-nowrap">
          <strong>Save image:</strong>
        </div>
        <div className="flex-max ml-2">
          <div className="mb-2">
            {supportedFormats.map(([format, quality]) => (
              <button key={format} className="mr-1" onClick={() => {
                exportImage(engine, projectName, format, quality, ui, legend);
                close();
              }}>
                <HiOutlineDownload /> {format.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="row">
            <BooleanField value={ui} onChange={setUi}>Include axes</BooleanField>
            <BooleanField value={legend} onChange={setLegend}>Include legend</BooleanField>
          </div>
        </div>
      </div>
    </>
  );
};

function exportImage(
  engine: EngineInterface,
  projectName: string,
  format: string,
  quality?: number,
  ui?: boolean,
  legend?: boolean,
): void {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  engine.exportOnto(canvas.getContext('2d')!, ui, legend);

  const el = document.createElement('a');
  el.download = `${sanitizeFileName(projectName)}.${format}`;
  el.href = canvas.toDataURL(`image/${format}`, quality);
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
  document.body.removeChild(canvas);
}

function resolveSupportedFormats(): SupportedFormat[] {
  const formats: SupportedFormat[] = [
    ['jpeg', 90],
    ['png'],
  ];

  const helper = document.createElement('canvas');
  helper.width = 10;
  helper.height = 10;

  return formats.filter(([type]) => helper.toDataURL(`image/${type}`).startsWith(`data:image/${type}`));
}
