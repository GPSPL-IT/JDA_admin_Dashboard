import React, { useEffect, useRef, useState } from 'react';

const MapObjectSvg = ({ level = 1, setLevel, mapId = 1, setMapId, mapData = [], legendItems }) => {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const mapUrl = `/map/level${level}/${mapId}.svg`;

  // Fetch SVG content
  useEffect(() => {
    let isMounted = true;
    const fetchMap = async () => {
      try {
        const response = await fetch(mapUrl);
        // Relaxed content-type check, trust response.ok + content validation

        if (response.ok) {
          const text = await response.text();

          if (isMounted) {
            try {
              // 🛠️ Advanced: Parse and fix SVG attributes for perfect centering
              const parser = new DOMParser();
              const doc = parser.parseFromString(text, "image/svg+xml");
              const svgElement = doc.querySelector('svg');

              if (svgElement) {
                // 1. Ensure ViewBox exists (critical for responsive scaling)
                if (!svgElement.hasAttribute('viewBox')) {
                  const w = svgElement.getAttribute('width');
                  const h = svgElement.getAttribute('height');
                  if (w && h) {
                    const vbW = parseFloat(w);
                    const vbH = parseFloat(h);
                    if (!isNaN(vbW) && !isNaN(vbH)) {
                      svgElement.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
                    }
                  }
                }

                // 2. Force it to fill container and maintain aspect ratio
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');
                svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                const serializer = new XMLSerializer();
                const newSvgContent = serializer.serializeToString(doc);
                setSvgContent(newSvgContent);
              } else {
                // Fallback
                if (text.includes('<svg')) setSvgContent(text);
                else {
                  console.warn(`Invalid SVG content for ${mapUrl}`);
                  setSvgContent(null);
                }
              }
            } catch (parseError) {
              console.error("Error parsing SVG:", parseError);
              if (text.includes('<svg')) setSvgContent(text);
            }
          }
        } else {
          if (isMounted) {
            console.warn(`Map file not found: ${mapUrl}`);
            setSvgContent(null);
          }
        }
      } catch (error) {
        console.error("Error fetching map:", error);
        if (isMounted) setSvgContent(null);
      }
    };

    fetchMap();

    return () => { isMounted = false; };
  }, [mapUrl]);

  // Attach event listeners to the injected SVG
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    const svgElements = container.querySelectorAll('[id]');

    // Attach Listeners
    svgElements.forEach((el) => {
      const regionId = el.id;
      const data = mapData.find((item) => item.id === regionId);

      // 🌟 Initial setup: Add classes, color, etc.
      if (data) {
        el.style.fill = data.color || "#CCC";
        el.style.cursor = 'pointer';
      }

      const onMouseEnter = () => {
        const data = mapData.find((item) => item.id === regionId);
        setHoveredData({ regionId, ...data });
      };

      const onMouseMove = (e) => {
        const bounds = container.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - bounds.left,
          y: e.clientY - bounds.top,
        });
      };

      const onMouseLeave = () => {
        setHoveredData(null);
      };

      const onClick = async (e) => {
        e.stopPropagation(); // Prevent bubbling
        const clickedId = el.id;

        const data = mapData.find((item) => item.id === clickedId);
        if (!data) return;

        const nextLevel = level + 1;
        const nextMapUrl = `/map/level${nextLevel}/${data.lgd_code}.svg`;

        // Check if next map exists before switching
        try {
          // We must fetch the content to see if it's SPA fallback or real SVG
          console.log(`Verifying existence of: ${nextMapUrl}`);
          const response = await fetch(nextMapUrl);
          if (response.ok) {
            const text = await response.text();
            if (text.includes('<svg')) {
              console.log("Valid SVG found, navigating...");
              setLevel(nextLevel);
              setMapId(data.lgd_code);
              setHoveredData(null);
            } else {
              console.warn(`Blocked navigation: File at ${nextMapUrl} is not a valid SVG (likely SPA fallback).`);
            }
          } else {
            console.warn(`Blocked navigation: Map file not found at ${nextMapUrl}`);
          }
        } catch (error) {
          console.error("Error checking next map:", error);
        }
      };

      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mousemove', onMouseMove);
      el.addEventListener('mouseleave', onMouseLeave);
      el.addEventListener('click', onClick);
    });

  }, [svgContent, mapData, level, setLevel, setMapId]);


  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
      {svgContent ? (
        <div
          ref={containerRef}
          className="w-full h-full flex justify-center items-center object-contain p-2 transition-all duration-300"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="text-gray-500">Loading Map...</div>
      )}

      {/* 🖱 Hover popup that follows mouse */}
      {hoveredData && (
        <div
          className="absolute bg-white p-2 shadow-lg rounded text-sm pointer-events-none"
          style={{
            top: mousePosition.y + 10,
            left: mousePosition.x + 10,
            maxWidth: '200px',
            zIndex: 50,
          }}
        >
          <div><strong>ID:</strong> {hoveredData.regionId}</div>
          {Object.entries(hoveredData).map(([key, value]) =>
            key !== 'regionId' ? (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default MapObjectSvg;
