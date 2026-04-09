from PIL import Image

def remove_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    # Best guess: use the absolute top-left pixel as the background color
    bg_color = datas[0]

    for item in datas:
        if abs(item[0] - bg_color[0]) <= 20 and abs(item[1] - bg_color[1]) <= 20 and abs(item[2] - bg_color[2]) <= 20:
            newData.append((255, 255, 255, 0)) # Fully transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_background("logo.png", "logo-transparent.png")
