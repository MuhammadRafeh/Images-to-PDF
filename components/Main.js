import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import ImageComponent from './ImageComponent';
import { MenuProvider } from 'react-native-popup-menu';
import DialogComponent from './Dialog';
import Buttons from './Buttons'

import { Button } from 'react-native-elements'

import {openGalleryApi, openCameraApi} from './api'

import { 
  addImages, 
  removeAllImages, 
  movePicDown, 
  movePicUp, 
  deleteImage, 
  addImagesAbove,
  addImagesBelow } from '../Redux/actions'
import { connect } from 'react-redux'

class Main extends React.Component {
  state = {
    showDialog: false
  }

  componentDidMount() {
    this.id = 0
    this.props.navigation.setOptions({
        headerLeft: () => (
          <Button title="Clear" buttonStyle={{marginLeft: 10}} type='clear' onPress={this.handleClearImages}/>)
      })
  }

  openGallery = async () => {
    const listOfUri = await openGalleryApi()
    if (!listOfUri) return //if listOfUri is false then return simply
    this.props.addImages(listOfUri)
  }

  openCamera = async () => {
    const listOfUri = await openCameraApi()
    if (!listOfUri) return //Simply Return if something went wrong
    this.props.addImages(listOfUri)
  }

  handleMakePDFButton = () => {
    this.toggleShowDialog(true)
  }

  toggleShowDialog = bool => {
    this.setState({showDialog: bool})
  }

  handleClearImages = () => {
    if (this.props.imagePaths.length>0){
      this.props.removeAllImages()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MenuProvider>
          <ScrollView>
            {this.props.imagePaths.map(uri =>
              <ImageComponent 
                imageObj={uri}
                key={uri.id}
                movePicUp={this.props.movePicUp}
                movePicDown={this.props.movePicDown}
                deleteImage={this.props.deleteImage}
                resizeMode={this.props.resizeMode}
                addImagesAbove={this.props.addImagesAbove}
                addImagesBelow={this.props.addImagesBelow}
              />)
            }
          </ScrollView>
        </MenuProvider>
        {this.state.showDialog && 
          <DialogComponent
            closeDialog={this.toggleShowDialog} //Prop to close Pop Up dialog
            imagesPath={this.props.imagePaths}
        />}
        <Buttons 
          handleMakePDFButton={this.handleMakePDFButton}
          openCamera={this.openCamera}
          openGallery={this.openGallery}
        />
      </View>
    )
  } 
}

const mapStateToProps = (state) => ({
  imagePaths: state.imagesPath,
  resizeMode: state.settings.resizeMode
})

const mapDispatchToProps = {
  addImages: addImages,
  removeAllImages: removeAllImages,
  movePicUp: movePicUp,
  movePicDown: movePicDown,
  deleteImage: deleteImage,
  addImagesAbove: addImagesAbove,
  addImagesBelow: addImagesBelow
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});