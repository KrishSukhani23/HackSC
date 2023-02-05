import temp_steg

image_list = ["image1.png","image2.png","image3.png","image4.png","image5.png"]

my_file = open("messages.txt", "r")

# reading the file
data = my_file.read()
  
# replacing end splitting the text 
# when newline ('\n') is seen.
data_into_list = data.split("\n")
print(data_into_list)
my_file.close()

for i in range(0,len(data_into_list)):
    message = data_into_list[i]
    imageFilename = image_list[i]
    newImageFilename = "stegno_image" + str(i+1)

    newImg = temp_steg.encodeLSB(message, imageFilename, newImageFilename)
    if not newImg is None:
            print("Stego image created.")

    print("Decoding...")
    message = temp_steg.decodeLSB(newImageFilename + ".png")
    print("Final message: ", message)

